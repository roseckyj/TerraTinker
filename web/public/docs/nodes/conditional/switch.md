# Switch node

This node has a `Switch value` and multiple `Case` values it chooses from. It returns the `Use` input form the first `Case` value, that matches the `Switch value`. If none of the `Case` values match, it returns the `Default` value.

<Node>
    {
        "type": "switch",
        "location": [
            75.95748782096712,
            835.1068179096029
        ],
        "inputs": {
            "value": {
                "kind": "link",
                "node": "c8f60bfa-e26d-484d-9a59-6469427425d7",
                "output": "output"
            },
            "default": {
                "kind": "value",
                "type": "material",
                "value": "cobblestone"
            },
            "0_case": {
                "kind": "value",
                "type": "string",
                "value": "motorway"
            },
            "0_use": {
                "kind": "value",
                "type": "material",
                "value": "black_concrete"
            },
            "1_case": {
                "kind": "value",
                "type": "string",
                "value": "footway"
            },
            "1_use": {
                "kind": "value",
                "type": "material",
                "value": "dirt_path"
            },
            "2_case": {
                "kind": "value",
                "type": "string",
                "value": "sidewalk"
            },
            "2_use": {
                "kind": "value",
                "type": "material",
                "value": "stone_bricks"
            }
        },
        "nodeData": {
            "inputType": "material",
            "switchType": "string",
            "cases": 3
        }
    }
</Node>

## Example

The following example shows the correct way of handling null values. Since OpenStreetMaps geometries are not guaranteed to have any specific tag, we need to handle the cases as best as we can. In this example, we are trying to get the height of a building. We try to get the height from three different tags. If none of them is present, we use a random number. As you can see the output of the [Null Switch node](/nodes/conditional/null_switch) is guaranteed to not be null since at least one of the inputs is known to not be null.

<NodeGraph>
    {"name":"Switch","id":"2f3bdaa2-4c88-4f4e-9cda-d4e684c9f379","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[101.09402530118129,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"efcbd062-b968-42df-adff-2b630fd782db","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[608.609244419828,519.7294112692304],"inputs":{"material":{"kind":"link","node":"4c9cad2c-1ea6-456f-811a-3b32f2e32bc2","output":"output"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"4c9cad2c-1ea6-456f-811a-3b32f2e32bc2":{"type":"switch","location":[75.95748782096712,835.1068179096029],"inputs":{"value":{"kind":"link","node":"c8f60bfa-e26d-484d-9a59-6469427425d7","output":"output"},"default":{"kind":"value","type":"material","value":"cobblestone"},"0_case":{"kind":"value","type":"string","value":"motorway"},"0_use":{"kind":"value","type":"material","value":"black_concrete"},"1_case":{"kind":"value","type":"string","value":"footway"},"1_use":{"kind":"value","type":"material","value":"dirt_path"},"2_case":{"kind":"value","type":"string","value":"sidewalk"},"2_use":{"kind":"value","type":"material","value":"stone_bricks"}},"nodeData":{"inputType":"material","switchType":"string","cases":3}},"efcbd062-b968-42df-adff-2b630fd782db":{"type":"osmLoader","location":[-795.8698081039784,183.75703023982953],"inputs":{},"nodeData":{"attributes":[{"type":"string","path":"highway"}],"requests":[{"node":false,"way":true,"relation":true,"query":"highway"}]}},"c8f60bfa-e26d-484d-9a59-6469427425d7":{"type":"forceNotNull","location":[-330.08885462579127,587.797112551849],"inputs":{"input":{"kind":"link","node":"efcbd062-b968-42df-adff-2b630fd782db","output":"highway"}},"nodeData":{"inputType":"string"}}}}
</NodeGraph>
