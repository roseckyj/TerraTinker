import {
    Box,
    Button,
    Flex,
    HStack,
    IconButton,
    Input,
    Select,
} from "@chakra-ui/react";
import { BiLayer, BiMap, BiTrash, BiTrip } from "react-icons/bi";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/AbstractNode";
import { GenericNode } from "../../components/GenericNode";
import { Variable } from "../../components/Variable";
import { varTypes } from "../../components/_varTypes";
import { GraphState } from "../../graphState/graphState";
import { Node, VarType } from "../../types/serializationTypes";
import { nodeInputEnabledStyle, nodeInputStyle } from "../../utils/styles";

type Attribute = {
    type: VarType;
    path: string;
};

type OverpassRequest = {
    node: boolean;
    way: boolean;
    relation: boolean;
    query: string;
};

const allowedTypes = ["float", "boolean", "string"];

export class OsmLoaderNode extends AbstractNode {
    static title = "OpenStreetMap Overpass API";
    static category = "Loaders";
    static type = "osmLoader";

    private attributes: Attribute[] = [];
    private requests: OverpassRequest[] = [
        {
            node: false,
            way: true,
            relation: true,
            query: "building",
        },
    ];

    public constructor(params: NodeConstructorParams) {
        super(
            {},
            {
                geometry: {
                    type: "geometry",
                    title: "Geometry",
                },
                id: {
                    type: "string",
                    title: "ID",
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
                nullable: key !== "geometry" && key !== "id",
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
                id: {
                    type: "float",
                    title: "ID",
                },
            }
        );
        this.updateInternalConnections();
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as OsmLoaderNode;

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
        data: { node, forceUpdate, updateConnections },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof AbstractNode;
        const thisNode = node as OsmLoaderNode;

        const osmRequest = `(
${thisNode.requests
    .map(
        (request) =>
            (request.node ? `  node[${request.query}]({{bbox}});\n` : "") +
            (request.way ? `  way[${request.query}]({{bbox}});\n` : "") +
            (request.relation
                ? `  relation[${request.query}]({{bbox}});\n`
                : "")
    )
    .join("")});
(._;>;);
out geom;`;

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
            >
                {Object.entries(node.inputs).map(([id, input]) => (
                    <Variable
                        key={id}
                        orientation="input"
                        param={id}
                        definition={input}
                        state={node.inputState[id]}
                        onChange={(value) => {
                            node.inputState[id].value = value;
                            forceUpdate();
                        }}
                    />
                ))}
                <Flex direction="column" alignItems="stretch" my={6}>
                    {thisNode.requests.map((request, i) => (
                        <HStack alignItems="center" mb={2} key={i}>
                            <Input
                                {...nodeInputStyle}
                                flexGrow={1}
                                type="text"
                                placeholder="Key query"
                                value={request.query}
                                onChange={(e) => {
                                    thisNode.requests[i].query = e.target.value;
                                    forceUpdate();
                                }}
                            />
                            <IconButton
                                {...(request.node
                                    ? nodeInputEnabledStyle
                                    : nodeInputStyle)}
                                aria-label="Get nodes"
                                icon={<BiMap />}
                                onClick={() => {
                                    thisNode.requests[i].node =
                                        !thisNode.requests[i].node;
                                    forceUpdate();
                                }}
                            />
                            <IconButton
                                {...(request.way
                                    ? nodeInputEnabledStyle
                                    : nodeInputStyle)}
                                aria-label="Get ways"
                                icon={<BiTrip />}
                                onClick={() => {
                                    thisNode.requests[i].way =
                                        !thisNode.requests[i].way;
                                    forceUpdate();
                                }}
                            />
                            <IconButton
                                {...(request.relation
                                    ? nodeInputEnabledStyle
                                    : nodeInputStyle)}
                                aria-label="Get relations"
                                icon={<BiLayer />}
                                onClick={() => {
                                    thisNode.requests[i].relation =
                                        !thisNode.requests[i].relation;
                                    forceUpdate();
                                }}
                            />
                            <IconButton
                                {...nodeInputStyle}
                                ml={4}
                                aria-label="Remove request"
                                icon={<BiTrash />}
                                onClick={() => {
                                    thisNode.requests.splice(i, 1);
                                    forceUpdate();
                                }}
                            />
                        </HStack>
                    ))}
                    <Button
                        {...nodeInputStyle}
                        onClick={() => {
                            thisNode.requests.push({
                                node: false,
                                way: true,
                                relation: true,
                                query: "building",
                            });
                            forceUpdate();
                        }}
                    >
                        Add request
                    </Button>
                    <Box
                        fontFamily="monospace"
                        whiteSpace="pre-wrap"
                        rounded="sm"
                        borderBottomRadius="none"
                        bg="whiteAlpha.200"
                        _hover={{}}
                        mt={2}
                        p={4}
                    >
                        {osmRequest}
                    </Box>
                    <Button
                        {...nodeInputStyle}
                        borderTopRadius="none"
                        as="a"
                        href={`https://overpass-turbo.eu/?Q=${encodeURIComponent(
                            osmRequest
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Open in Overpass Turbo
                    </Button>
                </Flex>
                <Variable
                    key={"geometry"}
                    orientation="output"
                    param={"geometry"}
                    definition={node.outputs["geometry"]}
                    state={node.outputState["geometry"]}
                />
                <Variable
                    key={"id"}
                    orientation="output"
                    param={"id"}
                    definition={node.outputs["id"]}
                    state={node.outputState["id"]}
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
                                type: "string",
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
