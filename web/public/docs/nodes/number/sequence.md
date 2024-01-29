# Sequence node

Sequence node is a [fork node](/layers/node_types/fork) that generates a sequence of numbers.

<Node>
    {
        "type": "sequence",
        "location": [0, 0],
        "inputs": {
            "from": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "step": {
                "kind": "value",
                "type": "float",
                "value": 1
            },
            "count": {
                "kind": "value",
                "type": "float",
                "value": 10
            }
        },
        "nodeData": {}
    }
</Node>

## Inputs

-   `From`: Starting value.
-   `Step`: Step between each number.
-   `Count`: Number of numbers to generate.

## Outputs

-   `Number`: Every number in the sequence.

## Example

This example shows alternative way of iterating over the selected region using a pair of Sequence nodes.

<NodeGraph>
    {"name":"Sequence","id":"58803fa1-81bf-496b-8948-3537d7207917","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"90bd18ec-f076-4cdb-9dc1-3d0867fff304":{"type":"selectedRegion","location":[-360.2393080321519,494.4263302635787],"inputs":{},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[608.609244419828,519.7294112692304],"inputs":{"material":{"kind":"value","type":"material","value":"grass_block"},"x":{"kind":"link","node":"a0d6a1e6-9677-4510-809b-ab0bc3cdac31","output":"number"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"61883008-2056-4333-b0ec-8a3c5500fd0a","output":"number"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"a0d6a1e6-9677-4510-809b-ab0bc3cdac31":{"type":"sequence","location":[66.42878674740541,491.81779296490083],"inputs":{"from":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"minX"},"step":{"kind":"value","type":"float","value":1},"count":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"width"}},"nodeData":{}},"61883008-2056-4333-b0ec-8a3c5500fd0a":{"type":"sequence","location":[67.48711574422992,708.393651583224],"inputs":{"from":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"minZ"},"step":{"kind":"value","type":"float","value":1},"count":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"height"}},"nodeData":{}}}}
</NodeGraph>
