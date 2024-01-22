import {
    Box,
    Flex,
    Heading,
    Link,
    ListItem,
    OrderedList,
    UnorderedList,
} from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";
import { ReactFlowProvider } from "reactflow";
import { GraphState } from "../../graphState/graphState";
import { NodeGraph } from "../nodeGraph/NodeGraph";
import { useOpenHelp } from "./HelpProvider";

export interface IRenderMarkdownProps {
    children: string;
}

export function RenderMarkdown({ children }: IRenderMarkdownProps) {
    const help = useOpenHelp();

    return (
        <Markdown
            children={children}
            options={{
                overrides: {
                    NodeGraph: (props) => (
                        <Box w="full" h="600px" mb={4}>
                            <NodeGraph
                                data={JSON.parse(props.children)}
                                readonly
                            />
                        </Box>
                    ),
                    Node: (props) => {
                        const data = JSON.parse(props.children);
                        const node = GraphState.deserializeNode(data, "sample");

                        if (!node) {
                            return null;
                        }

                        const Component = (node.constructor as any).Component;

                        return (
                            <ReactFlowProvider>
                                <Flex
                                    direction="row"
                                    justifyContent="center"
                                    alignItems="center"
                                    py={8}
                                >
                                    <Box
                                        display="inline-block"
                                        position="relative"
                                        mx={64}
                                    >
                                        <Component
                                            data={{
                                                forceUpdate: () => {},
                                                locked: true,
                                                node: node,
                                                updateConnections: () => {},
                                                version: 0,
                                            }}
                                            dragging={false}
                                            selected={false}
                                            id="sample"
                                            isConnectable={false}
                                            type="fill"
                                            xPos={0}
                                            yPos={0}
                                            zIndex={0}
                                        />
                                    </Box>
                                </Flex>
                            </ReactFlowProvider>
                        );
                    },
                    h1: (props) => (
                        <Heading as="h1" size="lg" mt={8} mb={4} {...props} />
                    ),
                    h2: (props) => (
                        <Heading as="h2" size="md" mt={8} mb={4} {...props} />
                    ),
                    h3: (props) => (
                        <Heading as="h3" size="sm" mt={8} mb={4} {...props} />
                    ),
                    h4: (props) => (
                        <Heading as="h4" size="xs" mt={8} mb={4} {...props} />
                    ),
                    ul: (props) => <UnorderedList mb={4} {...props} />,
                    ol: (props) => <OrderedList mb={4} {...props} />,
                    li: (props) => <ListItem {...props} />,
                    p: (props) => <Box mb={4} {...props} />,
                    a: (props) => (
                        <Link
                            as="span"
                            onClick={() => help(props.href)}
                            color="blue.400"
                            children={props.children}
                        />
                    ),
                },
            }}
        />
    );
}
