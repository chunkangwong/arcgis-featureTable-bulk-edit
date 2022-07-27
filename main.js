import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import "./App.css";

let selectedRows = [];
let isSet = false;

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
  autoRefreshEnabled: true,
});

// Add or remove selectedRows when a row is selected or deselected
featureTable.on("selection-change", () => {
  // FeatureTable.grid.selectedItems._items is a hidden, undocumented property and it is not recommended.
  // https://community.esri.com/t5/arcgis-api-for-javascript-questions/featuretable-get-selected-rows/td-p/1158129
  selectedRows = featureTable.grid.selectedItems._items.map(
    (item) => item.feature
  );
  if (!isSet) {
    featureTable.columns.items.forEach((item) => {
      item.on("value-change", (event) => {
        const field = event.column.__data.path;
        selectedRows.forEach((row) => {
          row.attributes[field] = event.value;
        });
      });
    });
    isSet = true;
  }
});
