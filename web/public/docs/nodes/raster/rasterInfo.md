# Raster Info node

This node provides information about a raster.

<Node>
    {
        "type": "rasterInfo",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Inputs

-   `Raster`: Raster to get information about.

## Outputs

-   `Region`: Geometry of the raster.
-   `Minimum value`: Minimum raw value in the raster.
-   `Maximum value`: Maximum raw value in the raster.
-   `Minimum Y`: Minimum value in raster translated from altitude to Y. This is a shorthand for using [transformations](/nodes/geometry/transformation) to convert the values.
-   `Maximum Y`: Maximum value in raster translated from altitude to Y.

## Example

This example uses a GeoTIFF file with altitude data to create a terrain. The terrain is then colored using other GeoTIFF file with additional raster info, that gets translated into a material using the Material Scale node.

<NodeGraph>
    {"name":"Material scale","id":"7d15b527-2f61-4751-8bb8-fd7268601c51","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4"],"startLocation":[1421.6621127954622,488.73801289266464]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[101.09402530118129,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"90bd18ec-f076-4cdb-9dc1-3d0867fff304":{"type":"selectedRegion","location":[-360.2393080321519,494.4263302635787],"inputs":{},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[1421.3106382635665,593.2685165126312],"inputs":{"material":{"kind":"link","node":"cac6dca1-618d-40ac-87a9-dfe683a7fff3","output":"output"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"link","node":"b5929971-95fe-45d3-aaba-84b9a4fa6b48","output":"y"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"b5929971-95fe-45d3-aaba-84b9a4fa6b48":{"type":"sampleRaster","location":[446.134547658781,835.5395054383222],"inputs":{"raster":{"kind":"link","node":"06ca6770-df5c-4305-aa1a-a129e2af43f6","output":"raster"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"}},"nodeData":{"interpolation":"bilinear"}},"06ca6770-df5c-4305-aa1a-a129e2af43f6":{"type":"geoTiffLoader","location":[154.86753708346595,927.9344532127391],"inputs":{"path":{"kind":"link","node":"cd3372b6-a443-4d21-a711-0ce0873fa3ef","output":"path"}},"nodeData":{}},"cd3372b6-a443-4d21-a711-0ce0873fa3ef":{"type":"localFile","location":[-208.2370353640316,917.6279915493822],"inputs":{},"nodeData":{"fileId":null}},"4081cbbd-a9ae-4cb3-99f6-a3ac52d1d595":{"type":"comment","location":[-221.9478985872363,1075.4836442460178],"inputs":{},"nodeData":{"content":"GeoTIFF with info about the altitude"}},"645fa230-1a3c-476d-a602-660b8bd51077":{"type":"localFile","location":[-204.444098222092,257.0482915094281],"inputs":{},"nodeData":{"fileId":null}},"a71ac3bf-62d3-49e6-ad79-f2dd23813a01":{"type":"geoTiffLoader","location":[159.48019182858434,292.8750350895465],"inputs":{"path":{"kind":"link","node":"645fa230-1a3c-476d-a602-660b8bd51077","output":"path"}},"nodeData":{}},"cda1b086-9597-4568-a461-45c86bb0dec1":{"type":"comment","location":[-215.75780672107675,182.56637722444512],"inputs":{},"nodeData":{"content":"GeoTIFF with additional raster info"}},"3e8ca607-d184-4304-ad02-6aaa100812c4":{"type":"sampleRaster","location":[449.8653766358598,261.7623367173384],"inputs":{"raster":{"kind":"link","node":"a71ac3bf-62d3-49e6-ad79-f2dd23813a01","output":"raster"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"}},"nodeData":{"interpolation":"bilinear"}},"cac6dca1-618d-40ac-87a9-dfe683a7fff3":{"type":"materialScale","location":[860.4860594553181,211.5492529275749],"inputs":{"min":{"kind":"link","node":"798175fb-a739-4257-a687-e8a7157a2151","output":"min"},"max":{"kind":"link","node":"798175fb-a739-4257-a687-e8a7157a2151","output":"max"},"input":{"kind":"link","node":"3e8ca607-d184-4304-ad02-6aaa100812c4","output":"value"}},"nodeData":{"scale":[{"from":0.1,"material":"white_wool"},{"from":0.25,"material":"white_concrete"},{"from":0.4,"material":"light_blue_wool"},{"from":0.55,"material":"light_blue_concrete"},{"from":0.7,"material":"blue_wool"},{"from":0.85,"material":"blue_concrete"}],"defaultMaterial":"snow_block"}},"798175fb-a739-4257-a687-e8a7157a2151":{"type":"rasterInfo","location":[449.5488476092622,-4.713029845399376],"inputs":{"raster":{"kind":"link","node":"a71ac3bf-62d3-49e6-ad79-f2dd23813a01","output":"raster"}},"nodeData":{}}}}
</NodeGraph>
