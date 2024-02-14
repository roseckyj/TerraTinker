# Roads

Layer, that creates roads using OpenStreetMap data.

The roads are rendered as dirt paths, but the material can be changed in the layer settings.
The roads are placed on terrain provided in a GeoTIFF file.

![Roads](/docs/samples/roads.png)

<NodeGraph>
    {"name":"Roads","id":"03ebc488-a4da-4a39-a483-ebf506cfc1e8","config":{"join":"cartesian"},"flow":{"nodes":["9b2b9900-d26c-48dc-b1dd-4dca8c8d4c9b"],"startLocation":[1529.077695493046,676.2244467600175]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[267.3993794391573,764.5080768052983],"inputs":{"geometry":{"kind":"link","node":"2e5e713f-9d71-472d-9a9c-de8749dff456","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"link","node":"c14ab57d-3f50-4f4d-9fb8-56fc9d1a92d6","output":"output"},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"2d02fe01-c6e8-40db-a80c-998f4a28a45d":{"type":"geoTiffLoader","location":[427.3810308458385,228.86131230043975],"inputs":{"path":{"kind":"link","node":"e0bc0fe7-db8d-4d21-82c8-ae8b85f19ebe","output":"path"}},"nodeData":{}},"b1fc421b-a326-4f04-be99-479600df8423":{"type":"sampleRaster","location":[739.6803952429402,271.72003383062196],"inputs":{"raster":{"kind":"link","node":"2d02fe01-c6e8-40db-a80c-998f4a28a45d","output":"raster"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"}},"nodeData":{"interpolation":"bilinear"}},"e0bc0fe7-db8d-4d21-82c8-ae8b85f19ebe":{"type":"localFile","location":[90.08305786677761,221.7224250885709],"inputs":{},"nodeData":{"fileId":"d9b38658-cfdb-49d0-bdcf-997c65c97e5f"}},"36c198f5-c974-4ac8-8f8a-93c077994cb4":{"type":"nullSwitch","location":[982.9376021715484,357.39276288763705],"inputs":{"0_case":{"kind":"link","node":"b1fc421b-a326-4f04-be99-479600df8423","output":"y"},"1_case":{"kind":"value","type":"float","value":0}},"nodeData":{"inputType":"float","cases":2}},"9b2b9900-d26c-48dc-b1dd-4dca8c8d4c9b":{"type":"setBlock","location":[1530.5334834449181,782.1306636516117],"inputs":{"material":{"kind":"value","type":"material","value":"dirt_path"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"link","node":"36c198f5-c974-4ac8-8f8a-93c077994cb4","output":"output"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"2e5e713f-9d71-472d-9a9c-de8749dff456":{"type":"osmLoader","location":[-938.2568679251824,423.96456331691934],"inputs":{},"nodeData":{"attributes":[],"requests":[{"node":false,"way":true,"relation":true,"query":"highway"}]}},"e66038ec-c6db-4ee7-ae6a-b39cc0ad0017":{"type":"metersToBlocks","location":[-465.7936488246132,988.2693300182007],"inputs":{"meters":{"kind":"value","type":"float","value":4}},"nodeData":{}},"c14ab57d-3f50-4f4d-9fb8-56fc9d1a92d6":{"type":"math","location":[-219.62042845157097,1041.2912544062406],"inputs":{"a":{"kind":"link","node":"e66038ec-c6db-4ee7-ae6a-b39cc0ad0017","output":"blocks"},"b":{"kind":"value","type":"float","value":1.2}},"nodeData":{"operator":"max"}}}}
</NodeGraph>