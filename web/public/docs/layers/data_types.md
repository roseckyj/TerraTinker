# Data types

Node inputs and outputs can be of different types. This section describes all the types that are used in the node graph.

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

## <span style="color: #6584fc;">Number</span>

A number is a numeric value. It can be a whole number or a decimal number. It can be positive or negative.

## <span style="color: #fc6b53;">Boolean</span>

A boolean is a value that can be either `true` or `false`. It is used to represent a truth value.

## <span style="color: #616161;">String</span>

A string is a sequence of characters. It can be used to carry text or file paths.

## <span style="color: #00ad50;">Geometry</span>

A geometry represents a sequence of points arranged into a multipolygon (a polygon with holes). It can be used to represent a shape.

## <span style="color: #fd5dba;">Raster</span>

A raster represents a grid of values. It can be sampled at any point to get a value.

## <span style="color: #fcf761;">Material</span>

A material represents a kind of Minecraft block.
