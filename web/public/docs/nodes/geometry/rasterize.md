# Rasterize node

Rasterize node is a [fork node](/layers/node_types/fork) that converts a region into individual pixels. It can be used pro filling blocks corresponding to a given geometry.

The node outputs a list of pairs of `X` and `Z` coordinates of each pixel in the rasterized image transformed to the world coordinates.

<Node>
    {
        "type": "rasterize",
        "location": [0, 0],
        "inputs": {
            "geometry": {
                "kind": "value",
                "type": "geometry",
                "value": null
            },
            "fill": {
                "kind": "value",
                "type": "boolean",
                "value": true
            },
            "strokeWeight": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "pointSize": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "clip": {
                "kind": "value",
                "type": "boolean",
                "value": false
            },
            "ignore": {
                "kind": "value",
                "type": "boolean",
                "value": false
            }
        },
        "nodeData": {}
    }
</Node>

## Inputs

-   `Geometry`: Geometry to rasterize.
-   `Fill`: Whether to fill the geometry.
-   `Stroke Weight`:\*\* Stroke weight. If 0, no stroke will be drawn.
-   `Point Size`:\*\* Point size. If 0, no points will be drawn.
-   `Clip to region`:\*\* Whether to clip the rasterized image to the selected region and ignore blocks outside.
-   `Ignore`: Whether to ignore the node (see [node types](/layers/node_types) for more information).

## Outputs

`X` and `Z` coordinates of each pixel in the rasterized image.

## Example

This simple example takes the selected region and fills it with grass blocks at the Y level 0.

<NodeGraph>
    {"name":"Rasterize","id":"34ad0809-a8d2-4675-a583-1d7d1ebf6ae9","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[101.09402530118129,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"90bd18ec-f076-4cdb-9dc1-3d0867fff304":{"type":"selectedRegion","location":[-360.2393080321519,494.4263302635787],"inputs":{},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[608.609244419828,519.7294112692304],"inputs":{"material":{"kind":"value","type":"material","value":"grass_block"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}}}}
</NodeGraph>
