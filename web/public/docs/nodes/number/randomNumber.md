# Random Number node

Generates a random number between two values.

<Node>
    {"type":"randomNumber","location":[0, 0],"inputs":{},"nodeData":{
        "randomSeed": false
    }}
</Node>

## Configuration

-   `Random seed`: If disabled, this node will allow user to input a seed value used for generating random number. For the same seed this node will always generate the same number.

## Inputs

-   `Decimal number`: If enabled, this node will generate a decimal number. If disabled, this node will generate an integer number.
-   `From`: Minimum value.
-   `To`: Maximum value.
-   `Seed`: Seed value used for generating random number. This input is only visible if `Random seed` is disabled. If null, the seed will be generated randomly.

## Outputs

-   `Number`: Random number.

## Example

This example uses loaded values for height. If none is provided, it will generate a random number between 3 and 9. and use it as height.

<NodeGraph>
    {"name":"Null switch","id":"7b959ceb-94b2-4cb7-8f47-325bfa8b079d","config":{"join":"cartesian"},"flow":{"nodes":["7d893a20-4889-4edf-b42a-5104a37bd9a2"],"startLocation":[368.2548466347371,381.72054880896445]},"nodes":{"a5a490e3-42ba-4550-8ec1-856504992860":{"type":"osmLoader","location":[-1404.2461535177094,70.04348034760858],"inputs":{},"nodeData":{"attributes":[{"type":"float","path":"height"},{"type":"float","path":"building:height"},{"type":"float","path":"building:levels"}],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"7d893a20-4889-4edf-b42a-5104a37bd9a2":{"type":"fill","location":[367.0063103591925,500.33113246937114],"inputs":{"material":{"kind":"value","type":"material","value":"air"},"minX":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"x"},"maxX":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"x"},"minY":{"kind":"value","type":"float","value":0},"maxY":{"kind":"link","node":"6dafbbc0-3ffa-4d44-861c-eb8428389578","output":"output"},"minZ":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"z"},"maxZ":{"kind":"link","node":"b52ced69-d214-4680-b33d-005d2a2eb8e3","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"b52ced69-d214-4680-b33d-005d2a2eb8e3":{"type":"rasterize","location":[-116.75474455208399,363.1395979821608],"inputs":{"geometry":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":false},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"6dafbbc0-3ffa-4d44-861c-eb8428389578":{"type":"nullSwitch","location":[-433.530695277813,612.2227820281453],"inputs":{"0_case":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"height"},"1_case":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"building:height"},"2_case":{"kind":"link","node":"582bc1bd-44d0-46cc-940d-a17866e4d04a","output":"output"},"3_case":{"kind":"link","node":"a220a411-4ccb-403d-ab9c-4e68d0acfeef","output":"output"}},"nodeData":{"inputType":"float","cases":4}},"582bc1bd-44d0-46cc-940d-a17866e4d04a":{"type":"math","location":[-788.7664088611673,810.1547045525949],"inputs":{"a":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"building:levels"},"b":{"kind":"value","type":"float","value":3}},"nodeData":{"operator":"multiply"}},"a220a411-4ccb-403d-ab9c-4e68d0acfeef":{"type":"randomNumber","location":[-787.7246619005123,1013.2953618803199],"inputs":{"decimal":{"kind":"value","type":"boolean","value":false},"from":{"kind":"value","type":"float","value":3},"to":{"kind":"value","type":"float","value":9},"seed":{"kind":"link","node":"a5a490e3-42ba-4550-8ec1-856504992860","output":"id"}},"nodeData":{"randomSeed":false}}}}
</NodeGraph>
