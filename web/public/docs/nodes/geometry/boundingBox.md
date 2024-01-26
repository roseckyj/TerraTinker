# Bounding Box node

This node calculates the bounding box of the input geometry.

<Node>
    {
        "type": "boundingBox",
        "location": [0, 0],
        "inputs": {
            "geometry": {
                "kind": "value",
                "type": "geometry",
                "value": null
            }
        },
        "nodeData": {}
    }
</Node>

## Inputs

-   `Geometry`: Geometry to calculate the bounding box of.

## Outputs

-   `Bounding Box`: Bounding box of the input geometry.
-   `Min X`: Minimum X coordinate of the bounding box.
-   `Max X`: Maximum X coordinate of the bounding box.
-   `Width (size X)`: Width of the bounding box.
-   `Min Z`: Minimum Z coordinate of the bounding box.
-   `Max Z`: Maximum Z coordinate of the bounding box.
-   `Height (size Z)`: Height of the bounding box.

## Example

This example draws a stone rectangle around each building obtained from the OpenStreetMap API.

<NodeGraph>
    {"name":"Bounding box","id":"34ad0809-a8d2-4675-a583-1d7d1ebf6ae9","config":{"join":"cartesian"},"flow":{"nodes":["1600b00e-bb15-462d-aacb-14f07fb0b710"],"startLocation":[606.5094154436105,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[193.47365904255798,376.4077874612592],"inputs":{"geometry":{"kind":"link","node":"31edd74e-fa61-486e-be6d-2b350607c3a3","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"value","type":"float","value":1},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"1600b00e-bb15-462d-aacb-14f07fb0b710":{"type":"setBlock","location":[606.8199769471686,517.2685220583203],"inputs":{"material":{"kind":"value","type":"material","value":"stone"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"31edd74e-fa61-486e-be6d-2b350607c3a3":{"type":"boundingBox","location":[-192.52241012926703,362.7444455308272],"inputs":{"input":{"kind":"link","node":"f41b4fac-bd10-47bb-a651-c99a6a3dbef5","output":"geometry"}},"nodeData":{}},"f41b4fac-bd10-47bb-a651-c99a6a3dbef5":{"type":"osmLoader","location":[-698.8164107768006,257.98407971027945],"inputs":{},"nodeData":{"attributes":[],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}}}}
</NodeGraph>
