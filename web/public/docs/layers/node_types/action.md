# Action node

Action nodes are nodes that can be a part of the Execution flow. They perform some action, like placing a block.

<Node>
    {
        "type": "setBlock",
        "location": [0, 0],
        "inputs": {
            "material": {
                "kind": "value",
                "type": "material",
                "value": "stone"
            },
            "x": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "y": {
                "kind": "value",
                "type": "float",
                "value": 0
            },
            "z": {
                "kind": "value",
                "type": "float",
                "value": 0
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

Action nodes have additional inputs and outputs at the top and bottom of the node. These inputs and outputs are used to connect the node to the Execution flow. The top-most node is guaranted to be executed first, and the bottom-most node is guaranted to be executed last. If a node is not connected to the Execution flow, it will not be executed.

## Input

Action nodes (as well as some fork nodes) have an input called `ignore`. If this input is set to `true`, the node will be ignored and will not be executed. This input is evaluated first so it can be used to conditionally execute the node.
