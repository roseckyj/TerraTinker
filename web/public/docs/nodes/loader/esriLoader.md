# ESRI Shapefile Loader

The ESRI Shapefile Loader loads vector data from ESRI Shapefiles.

<Node>
    {"type":"esriLoader","location":[0, 0],"inputs":{},"nodeData":{"attributes":[{"type":"float","path":"height"}]}}
</Node>

## Configuration

It allows you to load additional properies from attached table file. Types and names of the properties can be selected in the node's configuration. If no table column is matching the selected property name, the property will return null.

## Inputs

-   `Path`: Path to the ESRI Shapefile. It is strongly suggested to use [`Local File`](localFile) node to select the file.

## Outputs

-   `Geometry`: Geometry of a single feature.
-   `ID`: Features unique ID.
-   Additional selected properties.

## Example

<NodeGraph>
    {"name":"ESRI","id":"be8ccf89-f3ff-4706-8a77-c039a13cc6e4","config":{"join":"cartesian"},"flow":{"nodes":["24a41707-e1dc-4681-b062-273795f5783b"],"startLocation":[605.8968905930901,419.8009372837878]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[147.73600336403973,344.3595776143186],"inputs":{"geometry":{"kind":"link","node":"bc064328-cc89-44f9-b1e4-2abc6cf14a20","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"bc064328-cc89-44f9-b1e4-2abc6cf14a20":{"type":"esriLoader","location":[-496.91885454305674,499.1056020372225],"inputs":{"path":{"kind":"link","node":"d77e3d47-1086-4bf5-9855-b5a80a8b2271","output":"path"}},"nodeData":{"attributes":[{"type":"float","path":"height"}]}},"d77e3d47-1086-4bf5-9855-b5a80a8b2271":{"type":"localFile","location":[-865.3789684854282,512.332060700382],"inputs":{},"nodeData":{"fileId":null}},"a2974533-22a6-4cb0-83e7-3eb6afe416fa":{"type":"nullSwitch","location":[126.13103719567778,693.2929401445327],"inputs":{"0_case":{"kind":"link","node":"bc064328-cc89-44f9-b1e4-2abc6cf14a20","output":"height"},"1_case":{"kind":"value","type":"float","value":10}},"nodeData":{"inputType":"float","cases":2}},"24a41707-e1dc-4681-b062-273795f5783b":{"type":"fill","location":[606.8125857346463,522.8733426973798],"inputs":{"material":{"kind":"value","type":"material","value":"stone"},"minX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"maxX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"minY":{"kind":"value","type":"float","value":0},"maxY":{"kind":"link","node":"a2974533-22a6-4cb0-83e7-3eb6afe416fa","output":"output"},"minZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"maxZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>
