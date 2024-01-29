# Node graph

Node graph provides advanced options for transforming input geospatial data into Minecraft worlds. It works by placing nodes on a canvas and connecting them with links.

## Nodes

A single node represents a basic operation on data. It has inputs and outputs. Inputs can be either values or links to other nodes. Outputs can be linked to inputs of other nodes.

Nodes can be created by right-clicking on the canvas and selecting a node type from the menu. You can type to filter the nodes by name or category. Nodes can be moved by dragging them with the mouse. Nodes can be deleted by selecting them and pressing `Backspace` key.

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

Specific nodes are described in [a separate documentation section](/nodes).

There are multiple general types of nodes:

-   **Generic node**: generic transformation of data
-   **[Fork node](node_types/fork)**: for single input they can output multiple values
-   **[Action node](node_types/action)**: can be a part of the Execution flow. Performs some action, like placing a block.

Specific details about each node type are described in [a separate documentation section](node_types).

## Links

Links connect inputs and outputs of nodes. They represent the flow of data between nodes.

Links can be connected only between compatible inputs and outputs. For example, a `number` output can be connected to a `number` input, but not to a `boolean` input. Each data type is represented with different color. Different types of inputs and outputs are described in section about [data types](data_types).

Links must not form cycles. This means that a link cannot be created if it would create a cycle in the graph. For example, if `A` is connected to `B` and `B` is connected to `A`, then connecting `A` to `B` again would create a cycle.

Links can appear dashed. In case a link goes from an output with a black dot, that means, that the value can possibly be null. For more information about dealing with null values, see [dedicated section](null).

## Execution flow

Execution flow is a special type of node graph that is used to define the order of execution of action nodes. Unlike generic or fork nodes, it has additional input and output at the top and bottom respectively. The top-most node is guaranted to be executed first, and the bottom-most node is guaranted to be executed last. Do not forget to connect all action nodes to the execution flow, otherwise they will not be executed.

## Evaluation

The nodes are evaluated from end to start in the graph. This means that the nodes that are not connected to the output are not evaluated. If a fork node is hit during the evaluation, it's right side is then evaluated for all it's outputs. This also holds for action nodes so it is important to keep in mind the order of execution.

## Example

<NodeGraph>
    {"name":"Node graph example","id":"66bf58f4-fab9-4789-b08a-9a99991edefd","config":{"join":"cartesian"},"flow":{"nodes":["88bc77cb-f37e-4030-a568-035c9d3e39a4","24aab2fa-0894-4ea6-91e6-139e2167b117"],"startLocation":[608.3950335267746,418.5518658169457]},"nodes":{"1789b5be-a75c-457d-9d5a-14e7bdd147f8":{"type":"rasterize","location":[101.09402530118129,493.759663596912],"inputs":{"geometry":{"kind":"link","node":"90bd18ec-f076-4cdb-9dc1-3d0867fff304","output":"geometry"},"fill":{"kind":"value","type":"boolean","value":true},"strokeWeight":{"kind":"value","type":"float","value":0},"pointSize":{"kind":"value","type":"float","value":0},"clip":{"kind":"value","type":"boolean","value":false},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"90bd18ec-f076-4cdb-9dc1-3d0867fff304":{"type":"selectedRegion","location":[-360.2393080321519,494.4263302635787],"inputs":{},"nodeData":{}},"88bc77cb-f37e-4030-a568-035c9d3e39a4":{"type":"setBlock","location":[608.609244419828,519.7294112692304],"inputs":{"material":{"kind":"value","type":"material","value":"grass_block"},"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":0},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{}},"24aab2fa-0894-4ea6-91e6-139e2167b117":{"type":"placeTree","location":[608.9148377459503,766.4195464829041],"inputs":{"x":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"x"},"y":{"kind":"value","type":"float","value":1},"z":{"kind":"link","node":"1789b5be-a75c-457d-9d5a-14e7bdd147f8","output":"z"},"ignore":{"kind":"value","type":"boolean","value":false}},"nodeData":{"treeType":"tree"}},"a2ae2b96-9453-4b40-8dd2-9ca475d17c73":{"type":"comment","location":[2.592438795920998,348.49396050149875],"inputs":{},"nodeData":{"content":"This is a fork node denoted with the rocket. everything connected from the right to this node will get executed for each pixel of the rasterized geometry."}},"1d30bc1d-765b-4dcc-8263-1029f046fdaf":{"type":"comment","location":[507.92715654112783,297.28588021135977],"inputs":{},"nodeData":{"content":"Those nodes are action nodes connected to the execution flow. The block is guaranteed to be placed before planting the tree on top of it"}},"92194a38-0914-4d29-8125-d5426329c90e":{"type":"comment","location":[-439.0282531603839,394.26773563587466],"inputs":{},"nodeData":{"content":"This node is a generic node with only outputs.\n"}}}}
</NodeGraph>
