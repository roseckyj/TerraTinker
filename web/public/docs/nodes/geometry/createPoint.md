# Create point node

This node creates a simple geometry consisting of a single point at the specified coordinates.

<Node>
    {
        "type": "createPoint",
        "location": [0, 0],
        "inputs": {
            "x": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "z": {
                "kind": "value",
                "type": "float",
                "value": 0
            }
        },
        "nodeData": {}
    }
</Node>

## Inputs

-   `X`: X coordinate of the point in minecraft coordinates.
-   `Z`: Z coordinate of the point in minecraft coordinates.

## Outputs

`Geometry` containing the point.

## Example

This example creates an empty tower of height 10 at location [5, 5]. See [rasterize node](/nodes/geometry/rasterize) for more information about the rasterization.

<NodeGraph>
    {"name":"Create point","id":"34ad0809-a8d2-4675-a583-1d7d1ebf6ae9","config":{"join":"cartesian"},"flow":{"nodes":["a337eec8-6a3f-457b-8e12-904eed2788a3"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[120.77110979644965,420.88157287369563],"inputs":{"geometry":{"kind":"link","node":"ba5c1cdf-ce88-48c0-8051-209dca4fcc65","output":"output"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"value","type":"float","value":1},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"ba5c1cdf-ce88-48c0-8051-209dca4fcc65":{"type":"createPoint","location":[-217.79576707313825,357.72210603418284],"inputs":{"x":{"kind":"value","type":"float","value":5},"z":{"kind":"value","type":"float","value":5}},"nodeData":{}},"a337eec8-6a3f-457b-8e12-904eed2788a3":{"type":"fill","location":[608.6417817281349,513.6812201818658],"inputs":{"material":{"kind":"value","type":"material","value":"stone"},"minX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"maxX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"minY":{"kind":"value","type":"float","value":0},"maxY":{"kind":"value","type":"float","value":10},"minZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"maxZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>
