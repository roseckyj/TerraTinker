# Create rectangle node

This node creates a simple geometry consisting of a four points forming a rectangle at the specified coordinates.

<Node>
    {
        "type": "createRectangle",
        "location": [0, 0],
        "inputs": {
            "x1": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "z1": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "x2": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "z2": {
                "kind": "value",
                "type": "float",
                "value": 0
            }
        },
        "nodeData": {}
    }
</Node>

## Inputs

-   `X1`: X coordinate of the first point in minecraft coordinates.
-   `X2`: X coordinate of the second point in minecraft coordinates.
-   `Z1`: Z coordinate of the first point in minecraft coordinates.
-   `Z2`: Z coordinate of the second point in minecraft coordinates.

## Outputs

`Geometry` containing the rectangle.

## Example

This example creates an stone square of size 21×21 around the map center. See [rasterize node](/nodes/geometry/rasterize) for more information about the rasterization.

<NodeGraph>
    {"name":"Create rectangle","id":"34ad0809-a8d2-4675-a583-1d7d1ebf6ae9","config":{"join":"cartesian"},"flow":{"nodes":["1600b00e-bb15-462d-aacb-14f07fb0b710"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[164.1403257092246,373.74112079459246],"inputs":{"geometry":{"kind":"link","node":"5e8f836f-ecfe-402a-a4fe-4bb3a373dc62","output":"output"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"5e8f836f-ecfe-402a-a4fe-4bb3a373dc62":{"type":"createRectangle","location":[-120.73817542939634,246.99098498936968],"inputs":{"x1":{"kind":"value","type":"float","value":-10},"x2":{"kind":"value","type":"float","value":10},"z1":{"kind":"value","type":"float","value":-10},"z2":{"kind":"value","type":"float","value":10}},"nodeData":{}},"1600b00e-bb15-462d-aacb-14f07fb0b710":{"type":"setBlock","location":[606.8199769471686,517.2685220583203],"inputs":{"material":{"kind":"value","type":"material","value":"stone"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>
