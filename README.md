# ArcGIS FeatureTable Bulk Edit Feature

Sample code to demonstrate bulk editing feature on ArcGIS JS API FeatureTable widget.

## Installation
1. Clone this repository to your local machine.
2. Run the following command to install dependencies:
    ```cmd
    npm install
    ```
    or the following if you are using yarn:
    ```cmd
    yarn install
    ```
3. Run the following command to run the sample:
    ```cmd
    npm run dev
    ```
    or the following if you are using yarn:
    ```cmd
    yarn dev
    ```

## Instructions
1. First select a few rows.
2. Edit on one of the cells in anyone of the selected rows by double-clicking on the cell.
3. Press "Enter" to save the changes.
4. Observe the same changes on the rest of the selected rows.

## Experimental
This sample is using `FeatureTable.grid.selectedItems._items`, an undocumented property to determine the selected rows. You may refer to the Esri Community post [here](https://community.esri.com/t5/arcgis-api-for-javascript-questions/featuretable-get-selected-rows/td-p/1158129).
