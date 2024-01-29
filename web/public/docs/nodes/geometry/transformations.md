# Transformation nodes (A to B)

This set of nodes transform values between the real world and minecraft coordinates.

## Blocks to Meters, Meters to Blocks

This pair of nodes transforms distances along horizontal axes between Minecraft and real world.

<Node>
    {
        "type": "blocksToMeters",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

<Node>
    {
        "type": "metersToBlocks",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Y to Altitude, Altitude to Y

This pair of nodes transforms altitudes between Minecraft and real world.

<Node>
    {
        "type": "yToAltitude",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

<Node>
    {
        "type": "altitudeToY",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

## Y to Height, Height to Y

This pair of nodes transforms heights between Minecraft and real world.

<Node>
    {
        "type": "yToHeight",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

<Node>
    {
        "type": "heightToY",
        "location": [0, 0],
        "inputs": {},
        "nodeData": {}
    }
</Node>

**Warning! There is a difference between altitude and height. The world altitude can be not just scaled (as height), but shifted as well.**
