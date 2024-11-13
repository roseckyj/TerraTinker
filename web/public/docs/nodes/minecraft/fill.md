# Fill node

Fill node is an [action node](/layers/node_types/action) that fills the selected region with a material.

<Node>
    {
        "type": "fill",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Behavior

The node expects absolute coordinates of two corners. A cubic region is filled between these two corners. The region is inclusive of the two corners. The minimum and maximum corners can be defined interchangeably.

![fill.png](/docs/img/fill.png)

## Inputs

-   `Material`: Material to fill the region with.
-   `Min X`: Minimum X coordinate of the region.
-   `Max X`: Maximum X coordinate of the region.
-   `Min Y`: Minimum Y coordinate of the region.
-   `Max Y`: Maximum Y coordinate of the region.
-   `Min Z`: Minimum Z coordinate of the region.
-   `Max Z`: Maximum Z coordinate of the region.
-   `Ignore`: Whether to ignore the node (see [node types](/layers/node_types) for more information).

## Common usage

Common usage van include extruding a geometry. This can be achieved by [rasterizing](/nodes/geometry/rasterize) the geometry and then filling each column with a material.

<NodeGraph>
    {"name":"Filling buildings","id":"e6d34cb0-a4ca-40ba-8ccc-61a582021720","disabled":false,"config":{},"flow":{"nodes":["b53ebfdb-d667-4609-9ae8-d0cc1f41d986"],"startLocation":[611.0617001934412,459.21853248361236]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[143.97876388773727,489.93066908025526],"inputs":{"geometry":{"kind":"link","node":"5e4110c6-674d-4567-9e28-17e870824e56","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"5e4110c6-674d-4567-9e28-17e870824e56":{"type":"osmLoader","location":[-543.815031806162,431.82243137359563],"inputs":{},"nodeData":{"attributes":[],"requests":[{"node":false,"way":true,"relation":true,"query":"building"}]}},"b53ebfdb-d667-4609-9ae8-d0cc1f41d986":{"type":"fill","location":[611.5183015271713,564.4890980402621],"inputs":{"material":{"kind":"value","type":"material","value":"white_concrete"},"minX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"maxX":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"minY":{"kind":"value","type":"float","value":0},"maxY":{"kind":"value","type":"float","value":5},"minZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"maxZ":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>
