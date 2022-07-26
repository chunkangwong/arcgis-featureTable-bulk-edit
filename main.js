import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import "./App.css";

let selectedRows = [];

const featureLayer = new FeatureLayer({
  url: "https://services2.arcgis.com/GrCObcYo81O3Ymu8/arcgis/rest/services/HDB_Car_Park_Location/FeatureServer/0",
  outFields: ["*"],
});

const map = new Map({
  basemap: "topo-vector",
  layers: [featureLayer],
});

const mapView = new MapView({
  container: "viewDiv",
  map: map,
  center: [103.78, 1.34],
  zoom: 11,
});

const featureTable = new FeatureTable({
  view: mapView,
  layer: featureLayer,
  container: "tableDiv",
  editingEnabled: true,
});

// Add or remove selectedRows when a row is selected or deselected
featureTable.on("selection-change", () => {
  // FeatureTable.grid.selectedItems._items is a hidden, undocumented property and it is not recommended.
  // https://community.esri.com/t5/arcgis-api-for-javascript-questions/featuretable-get-selected-rows/td-p/1158129
  selectedRows = featureTable.grid.selectedItems._items.map(
    (item) => item.feature
  );
});

// Apply attribute edits to the rest of selectedRows
featureLayer.on("edits", (event) => {
  // Check if the edit is from user input rather than the subsequent bulk row update
  if (
    event.edits &&
    event.edits.updateFeatures.length === 1 &&
    event.edits.updateFeatures[0].attributes.GlobalID
  ) {
    const editedFeature = event.edits.updateFeatures[0];
    // Find the previous version of the edited feature
    const initalFeature = selectedRows.find(
      (row) => row.attributes.ObjectId === editedFeature.attributes.ObjectId
    );
    if (initalFeature) {
      // Find the updated attributes of the edited feature
      const updatedKeys = Object.keys(editedFeature.attributes).filter(
        (key) => editedFeature.attributes[key] !== initalFeature.attributes[key]
      );
      // Apply the same attribute edit to the rest of the selectedRows
      const applyEditPromise = new Promise((resolve, reject) => {
        updatedKeys.forEach((key, index, array) => {
          selectedRows = selectedRows.map((row) => {
            row.attributes[key] = editedFeature.attributes[key];
            return row;
          });
          featureLayer
            .applyEdits({ updateFeatures: selectedRows })
            .then(() => {
              console.log("Apply edits success");
              if (index === array.length - 1) {
                resolve();
              }
            })
            .catch((err) => {
              reject(err);
            });
        });
      });
      // Refresh featureTable once all edits are applied
      applyEditPromise
        .then(() => {
          featureTable.refresh();
          console.log("Refreshed");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});
