# Geometry Overlap node

This node returns true if the two input geometries overlap.

Note: This node is currently very inefficient, since it rasterizes the geometries and then checks if the rasters overlap.

<Node>
    {
        "type": "geometryOverlap",
        "location": [0, 0],
        "inputs": {
            "a": {
                "kind": "value",
                "type": "geometry",
                "value": null
            },
            "b": {
                "kind": "value",
                "type": "geometry",
                "value": null
            }
        },
        "nodeData": {}
    }
</Node>

## Inputs

-   `A`: The first geometry.
-   `B`: The second geometry.

## Outputs

-   `Overlap`: True if the two geometries overlap.

## Example

This example draws buildings from OpenStreetMap and finds the quality of life from the geometries in a second dataset.

<NodeGraph>
    {"name":"Geometry overlap","id":"34ad0809-a8d2-4675-a583-1d7d1ebf6ae9","config":{"join":"cartesian"},"flow":{"nodes":["a25cb4c5-5d42-4b51-9f7f-f4e97f2c1ad6"],"startLocation":[671.728366860108,375.589431941015]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[193.47365904255798,376.4077874612592],"inputs":{"geometry":{"kind":"link","node":"f41b4fac-bd10-47bb-a651-c99a6a3dbef5","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"link","node":"a1593d36-fb61-4cf4-a316-c1c7a74dcd49","output":"output"}},"nodeData":{}},"f41b4fac-bd10-47bb-a651-c99a6a3dbef5":{"type":"osmLoader","location":[-923.2911829447029,59.918104268012684],"inputs":{},"nodeData":{"attributes":[],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"5c18dce6-144e-44a0-bdde-a2a8eadf2ca5":{"type":"geometryOverlap","location":[-449.3904702739635,133.86312473279048],"inputs":{"a":{"kind":"link","node":"bb271990-b8cb-4630-8475-bca54c816749","output":"geometry"},"b":{"kind":"link","node":"f41b4fac-bd10-47bb-a651-c99a6a3dbef5","output":"geometry"}},"nodeData":{}},"bb271990-b8cb-4630-8475-bca54c816749":{"type":"geoJsonLoader","location":[-919.7277025095141,-244.2171549156274],"inputs":{"path":{"kind":"link","node":"426b8e81-ebe1-48f4-a263-ac1f9a8fcfed","output":"path"}},"nodeData":{"attributes":[{"type":"float","path":"qualityOfLife"}]}},"426b8e81-ebe1-48f4-a263-ac1f9a8fcfed":{"type":"localFile","location":[-1253.7051403189391,-224.04764739361207],"inputs":{},"nodeData":{"fileId":null}},"a1593d36-fb61-4cf4-a316-c1c7a74dcd49":{"type":"not","location":[-165.39119181545908,548.7890182808499],"inputs":{"input":{"kind":"link","node":"5c18dce6-144e-44a0-bdde-a2a8eadf2ca5","output":"output"}},"nodeData":{}},"3261390c-adf8-4038-8f06-7dc132a7b4f2":{"type":"materialScale","location":[93.67202485338612,-253.23076423517915],"inputs":{"min":{"kind":"value","type":"float","value":0},"max":{"kind":"value","type":"float","value":100},"input":{"kind":"link","node":"17d33d93-2f0a-4715-bce0-b44ad7c5d8eb","output":"output"}},"nodeData":{"scale":[{"from":0.2,"material":"orange_concrete"},{"from":0.4,"material":"yellow_concrete"},{"from":0.6,"material":"lime_concrete"},{"from":0.8,"material":"green_concrete"}],"defaultMaterial":"red_concrete"}},"17d33d93-2f0a-4715-bce0-b44ad7c5d8eb":{"type":"forceNotNull","location":[-313.8258213552835,-127.58057759217857],"inputs":{"input":{"kind":"link","node":"bb271990-b8cb-4630-8475-bca54c816749","output":"qualityOfLife"}},"nodeData":{"inputType":"float"}},"a25cb4c5-5d42-4b51-9f7f-f4e97f2c1ad6":{"type":"fill","location":[672.500284672592,471.8272683118314],"inputs":{"material":{"kind":"link","node":"3261390c-adf8-4038-8f06-7dc132a7b4f2","output":"output"},"minX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"maxX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"minY":{"kind":"value","type":"float","value":0},"maxY":{"kind":"value","type":"float","value":10},"minZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"maxZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>
