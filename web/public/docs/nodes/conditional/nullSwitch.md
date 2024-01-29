# Null Switch node

This node takes multiple inputs and outputs the first one that is not null. If all inputs are null, it outputs a null value.

<Node>
    {
        "type": "nullSwitch",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {
            "inputType": "float",
            "cases": 4
        }
    }
</Node>

## Example

The following example shows the correct way of handling null values. Since OpenStreetMaps geometries are not guaranteed to have any specific tag, we need to handle the cases as best as we can. In this example, we are trying to get the height of a building. We try to get the height from three different tags. If none of them is present, we use a random number. As you can see the output of the [Null Switch node](/nodes/conditional/null_switch) is guaranteed to not be null since at least one of the inputs is known to not be null.

<NodeGraph>
    {"name":"Null switch","id":"7b959ceb-94b2-4cb7-8f47-325bfa8b079d","config":{"join":"cartesian"},"flow":{"nodes":["7d893a20-4889-4edf-b42a-5104a37bd9a2"],"startLocation":[368.2548466347371,381.72054880896445]},"nodes":{"a5a490e3-42ba-4550-8ec1-856504992860":{"type":"osmLoader","location":[-1404.2461535177094,70.04348034760858],"inputs":{},"nodeData":{"attributes":[{"type":"float","path":"height"},{"type":"float","path":"building:height"},{"type":"float","path":"building:levels"}],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"7d893a20-4889-4edf-b42a-5104a37bd9a2":{"type":"fill","location":[367.0063103591925,500.33113246937114],"inputs":{"material":{"kind":"value","type":"material","value":"air"},"minX":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"x"},"maxX":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"x"},"minY":{"kind":"value","type":"float","value":0},"maxY":{"kind":"link","node":"6dafbbc0-3ffa-4d44-861c-eb8428389578","output":"output"},"minZ":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"z"},"maxZ":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"b52ced69-d214-4680-b33d-005d2a2eb8e3":{"type":"rasterize","location":[-116.75474455208399,363.1395979821608],"inputs":{"geometry":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"6dafbbc0-3ffa-4d44-861c-eb8428389578":{"type":"nullSwitch","location":[-433.530695277813,612.2227820281453],"inputs":{"0_case":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"height"},"1_case":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"building:height"},"2_case":{"kind":"link","node":"582bc1bd-44d0-46cc-940d-a17866e4d04a","output":"output"},"3_case":{"kind":"link","node":"a220a411-4ccb-403d-ab9c-4e68d0acfeef","output":"output"}},"nodeData":{"inputType":"float","cases":4}},"582bc1bd-44d0-46cc-940d-a17866e4d04a":{"type":"math","location":[-788.7664088611673,810.1547045525949],"inputs":{"a":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"building:levels"},"b":{"kind":"value","type":"float","value":3}},"nodeData":{"operator":"multiply"}},"a220a411-4ccb-403d-ab9c-4e68d0acfeef":{"type":"randomNumber","location":[-787.7246619005123,1013.2953618803199],"inputs":{"decimal":{"kind":"value","type":"boolean","value":false},"from":{"kind":"value","type":"float","value":3},"to":{"kind":"value","type":"float","value":9},"seed":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"id"}},"nodeData":{"randomSeed":false}}}}
</NodeGraph>
