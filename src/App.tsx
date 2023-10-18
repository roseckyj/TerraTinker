import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import ReactFlow, {
    Background,
    BackgroundVariant,
    Connection,
    Controls,
    EdgeTypes,
    NodeTypes,
    addEdge,
    useEdgesState,
    useNodesState,
} from "reactflow";
import { Edge } from "./components/Edge";
import { separator } from "./components/Variable";
import { nodes as nodeDefs } from "./nodes/_nodes";
import { sampleData } from "./sampleData";
import { Data } from "./types/graphTypes";

const nodeTypes: NodeTypes = Object.entries(nodeDefs).reduce(
    (prev, [key, value]) => ({ ...prev, [key]: value.component }),
    {}
);

const edgeTypes: EdgeTypes = {
    variable: Edge,
};

function App() {
    const [data, setData] = useState<Data>(sampleData);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    useEffect(() => {
        setNodes(
            Object.entries(data.nodes).map(([id, node]) => ({
                id,
                position: { x: node.location[0], y: node.location[1] },
                data: node,
                type: node.type,
            }))
        );
        setEdges(
            Object.entries(data.nodes)
                .map(([id, node]) =>
                    Object.entries(node.inputs)
                        .filter(([, input]) => input.kind === "link")
                        .map(([inputId, input]: [string, any]) => {
                            return {
                                id: `${id}${separator}${inputId}`,
                                source: input.node,
                                sourceHandle: input.output,
                                target: id,
                                targetHandle: inputId,
                                type: "variable",
                                data: {
                                    varType:
                                        nodeDefs[node.type!].inputs(node)[
                                            inputId
                                        ].type,
                                },
                            };
                        })
                )
                .flat()
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    useEffect(() => console.log(edges), [edges]);

    return (
        <Box position="fixed" inset="0" overflow="hidden">
            <Box
                as={ReactFlow}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={(params: Connection) => {
                    setEdges((eds) =>
                        addEdge(
                            {
                                ...params,
                                type: "variable",
                                data: { varType: "float" },
                            },
                            eds
                        )
                    );
                }}
                bg="#1D1D1D"
                color="#ffffff"
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            >
                <Controls />
                <Background
                    variant={BackgroundVariant.Dots}
                    color="#ffffff20"
                />
            </Box>
        </Box>
    );
}

export default App;
