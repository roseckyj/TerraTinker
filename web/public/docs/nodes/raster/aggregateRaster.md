# Aggregate Raster node

Aggregates values of a raster bounded by a geometry.

<Node>
    {
        "type": "aggregateRaster",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Configuration

-   `Interpolation`: Interpolation method to use when fetching the value. `Nearest` will return the value of the nearest pixel. `Bilinear` will interpolate the value from the four nearest pixels to smooth the value.

## Inputs

-   `Raster`: Raster to sample.
-   `Geometry`: Geometry inside which to aggregate the values.

## Outputs

-   `Minimum value`: Raw minimum value inside the geometry.
-   `Maximum value`: Raw maximum value inside the geometry.
-   `Average value`: Raw average value inside the geometry.
-   `Minimum Y`: Minimum value inside the geometry translated from altitude to Y. This is a shorthand for using [transformations](/nodes/geometry/transformation) to convert the values.
-   `Maximum Y`: Maximum value inside the geometry translated from altitude to Y.
-   `Average Y`: Average value inside the geometry translated from altitude to Y.

## Example

This example shows how to place a building on a terrain. The building is placed such that it's bottom is at the lowest point of the terrain and it's height is added to the top of the terrain.

<NodeGraph>
    {"name":"Aggregate raster","id":"7b959ceb-94b2-4cb7-8f47-325bfa8b079d","config":{"join":"cartesian"},"flow":{"nodes":["7d893a20-4889-4edf-b42a-5104a37bd9a2"],"startLocation":[368.2548466347371,381.72054880896445]},"nodes":{"a5a490e3-42ba-4550-8ec1-856504992860":{"type":"osmLoader","location":[-801.4286565955464,70.04348034760858],"inputs":{},"nodeData":{"attributes":[{"type":"float","path":"height"}],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"7d893a20-4889-4edf-b42a-5104a37bd9a2":{"type":"fill","location":[367.0063103591925,500.33113246937114],"inputs":{"material":{"kind":"value","type":"material","value":"stone"},"minX":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"x"},"maxX":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"x"},"minY":{"kind":"link","node":"f456b0af-6c1a-4405-8f2e-15a5d1d904d2","output":"min"},"maxY":{"kind":"link","node":"a46f8acc-ce75-458e-bef8-712e51f56d0f","output":"output"},"minZ":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"z"},"maxZ":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"b52ced69-d214-4680-b33d-005d2a2eb8e3":{"type":"rasterize","location":[-116.75474455208399,363.1395979821608],"inputs":{"geometry":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"f72a9370-a49e-40d0-b56c-8ef03d5c95de":{"type":"localFile","location":[-982.5502160021587,717.2069516741778],"inputs":{},"nodeData":{"fileId":null}},"34e44e07-b970-4dcf-90dc-6cd61a4fadd1":{"type":"geoTiffLoader","location":[-636.4883196209171,750.696812614298],"inputs":{"path":{"kind":"link","node":"f72a9370-a49e-40d0-b56c-8ef03d5c95de","output":"path"}},"nodeData":{}},"f456b0af-6c1a-4405-8f2e-15a5d1d904d2":{"type":"aggregateRaster","location":[-359.8868755599246,745.7353517342802],"inputs":{"raster":{"kind":"link","node":"34e44e07-b970-4dcf-90dc-6cd61a4fadd1","output":"raster"},"geometry":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"geometry"}},"nodeData":{"interpolation":"bilinear"}},"a46f8acc-ce75-458e-bef8-712e51f56d0f":{"type":"math","location":[63.07766446159303,842.4838388946273],"inputs":{"a":{"kind":"link","node":"f456b0af-6c1a-4405-8f2e-15a5d1d904d2","output":"max"},"b":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"height"}},"nodeData":{"operator":"add"}}}}
</NodeGraph>
