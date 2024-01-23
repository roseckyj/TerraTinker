import {
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Select,
} from "@chakra-ui/react";
import { BiTrash } from "react-icons/bi";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { varTypes } from "../../components/nodeGraph/_varTypes";
import { GraphState } from "../../graphState/graphState";
import { Node, VarType } from "../../types/layerTypes";
import { nodeInputStyle } from "../../utils/styles";

type Attribute = {
    type: VarType;
    path: string;
};

const allowedTypes = ["float", "boolean", "string"];

export abstract class AbstractGenericLoaderNode extends AbstractNode {
    private attributes: Attribute[] = [];

    public constructor(params: NodeConstructorParams) {
        super(
            {
                path: {
                    type: "string",
                    title: "Path",
                },
            },
            {
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
            },
            params
        );
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);
        this.updateInternalConnections();
    }

    private updateInternalConnections() {
        this.outputState = {};
        Object.keys(this.outputs).forEach((key) => {
            this.outputState[key] = {
                nullable: key !== "geometry",
            };
        });
    }

    private generateOutputs() {
        this.outputs = this.attributes.reduce(
            (acc, attribute, i) => ({
                ...acc,
                [attribute.path]: {
                    type: attribute.type,
                    title: attribute.path,
                },
            }),
            {
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
            }
        );
        this.updateInternalConnections();
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(
            id,
            node
        ) as AbstractGenericLoaderNode;

        if (node.nodeData.attributes) {
            created.attributes = node.nodeData.attributes;
            created.generateOutputs();
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            attributes: this.attributes,
        };
    }

    public setAttribute(index: number, type: VarType, path: string) {
        this.attributes[index] = {
            type,
            path,
        };
        this.generateOutputs();
    }

    public static Component({
        data: { node, forceUpdate, updateConnections, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as AbstractGenericLoaderNode;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                tags={["fork"]}
                locked={locked}
            >
                {Object.entries(node.inputs).map(([id, input]) => (
                    <Variable
                        key={id}
                        orientation="input"
                        param={id}
                        definition={input}
                        state={node.inputState[id]}
                        locked={locked}
                        onChange={(value) => {
                            node.inputState[id].value = value;
                            forceUpdate();
                        }}
                    />
                ))}
                <Variable
                    key={"geometry"}
                    orientation="output"
                    param={"geometry"}
                    definition={node.outputs["geometry"]}
                    state={node.outputState["geometry"]}
                    locked={locked}
                />
                {thisNode.attributes.map((attribute, i) => (
                    <Flex
                        direction="column"
                        w={96}
                        key={i}
                        mt={3}
                        pt={3}
                        borderTopColor="gray.500"
                        borderTopWidth={1}
                    >
                        <HStack alignItems="center" mb={2}>
                            <Input
                                {...nodeInputStyle}
                                flexGrow={1}
                                type="text"
                                placeholder="Attribute name"
                                value={attribute.path}
                                onChange={(e) => {
                                    thisNode.setAttribute(
                                        i,
                                        thisNode.attributes[i].type,
                                        e.target.value
                                    );
                                    forceUpdate();
                                    updateConnections();
                                }}
                            />
                            <Select
                                {...nodeInputStyle}
                                value={attribute.type}
                                w={44}
                                onChange={(e) => {
                                    thisNode.setAttribute(
                                        i,
                                        e.target.value as any,
                                        thisNode.attributes[i].path
                                    );
                                    forceUpdate();
                                    updateConnections();
                                }}
                            >
                                {allowedTypes.map((type, j) => (
                                    <option key={j} value={type}>
                                        {(varTypes as any)[type].title}
                                    </option>
                                ))}
                            </Select>
                            <IconButton
                                {...nodeInputStyle}
                                aria-label="Remove attribute"
                                icon={<BiTrash />}
                                onClick={() => {
                                    thisNode.attributes.splice(i, 1);
                                    thisNode.generateOutputs();
                                    forceUpdate();
                                    updateConnections();
                                }}
                            />
                        </HStack>
                        <Variable
                            key={attribute.path}
                            orientation="output"
                            param={attribute.path}
                            definition={node.outputs[attribute.path]}
                            state={node.outputState[attribute.path]}
                            locked={locked}
                        />
                    </Flex>
                ))}
                <Flex
                    direction="column"
                    mt={3}
                    pt={3}
                    borderTopColor="gray.500"
                    borderTopWidth={1}
                    w={96}
                >
                    <Button
                        {...nodeInputStyle}
                        onClick={() => {
                            thisNode.attributes.push({
                                type: "float",
                                path: "newAttribute",
                            });
                            thisNode.generateOutputs();
                            forceUpdate();
                            updateConnections();
                        }}
                    >
                        Add attribute
                    </Button>
                </Flex>
            </GenericNode>
        );
    }
}
