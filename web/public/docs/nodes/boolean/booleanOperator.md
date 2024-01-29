# Boolean Operator node

This node performs a boolean operation on two boolean values.

<Node>
    {
        "type": "booleanOperator",
        "location": [0, 0],
        "inputs": {
            "a": {
                "kind": "value",
                "type": "boolean",
                "value": false
            },
            "b": {
                "kind": "value",
                "type": "boolean",
                "value": false
            }
        },
        "nodeData": {}
    }
</Node>

## Operators

-   `AND`: Returns `true` if both inputs are `true`.
-   `OR`: Returns `true` if either input is `true`.
-   `XOR`: Returns `true` if exactly one input is `true`.
-   `NAND`: Returns `true` if either input is `false`.
-   `NOR`: Returns `true` if both inputs are `false`.
-   `XNOR`: Returns `true` if both inputs are the same.

## Inputs

`A` and `B`: Boolean values to perform the operation on.

## Outputs

`Result`: Result of the operation.
