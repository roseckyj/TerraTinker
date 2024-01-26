# Selected Region node

This is a passive input node containing information about the selected region and its properties.

<Node>
    {
        "type": "selectedRegion",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Outputs

-   `Geometry`: The rectangle with the size of the selected region.
-   `Min X`: The minimum X coordinate of the selected region.
-   `Max X`: The maximum X coordinate of the selected region.
-   `Width (size X)`: The width of the selected region.
-   `Min Z`: The minimum Z coordinate of the selected region.
-   `Max Z`: The maximum Z coordinate of the selected region.
-   `Height (size Z)`: The depth of the selected region.
-   `Minimum Altitude`: The selected minimum altitude.
-   `Horizontal Scale`: The scaling along the XZ plane.
-   `Vertical Scale`: The scaling along the Y axis.

## Example

This example shows how to sample a raster at each pixel of the selected region and draw terrain from the values of the raster.

<NodeGraph>
    {"name":"Selected Region, sample raster","id":"bb4e014a-b424-4e2a-b5b9-6b49cadd81ec","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4"],"startLocation":[609.6206920315683,473.70649853266445]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[32.457149032731195,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"90bd18ec-f076-4cdb-9dc1-3d0867fff304":{"type":"selectedRegion","location":[-360.2393080321519,494.4263302635787],"inputs":{},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[611.0605614294154,568.7557514609804],"inputs":{"material":{"kind":"value","type":"material","value":"grass_block"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"link","node":"76d09fdb-d716-428d-938b-d05a991cbe4a","output":"y"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"5e43e206-9fe6-4a1f-a2d0-37e055f5de0f":{"type":"geoTiffLoader","location":[36.54272648148492,290.9490953617568],"inputs":{"path":{"kind":"link","node":"9ab95bbb-7f0b-4392-a8c5-1872a4a356d0","output":"path"}},"nodeData":{}},"76d09fdb-d716-428d-938b-d05a991cbe4a":{"type":"sampleRaster","location":[360.07067515251043,271.7230587748635],"inputs":{"raster":{"kind":"link","node":"5e43e206-9fe6-4a1f-a2d0-37e055f5de0f","output":"raster"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"}},"nodeData":{"interpolation":"bilinear"}},"9ab95bbb-7f0b-4392-a8c5-1872a4a356d0":{"type":"localFile","location":[-391.90089999274414,264.0411469404057],"inputs":{},"nodeData":{"fileId":null}}}}
</NodeGraph>
