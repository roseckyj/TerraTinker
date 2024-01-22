import { Box, Heading, Link } from "@chakra-ui/react";
import Markdown from "markdown-to-jsx";
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
                        <Box w="full" h="600px">
                            <NodeGraph
                                data={JSON.parse(props.children)}
                                readonly
                            />
                        </Box>
                    ),
                    h1: (props) => <Heading as="h1" size="lg" {...props} />,
                    h2: (props) => <Heading as="h2" size="md" {...props} />,
                    h3: (props) => <Heading as="h3" size="sm" {...props} />,
                    h4: (props) => <Heading as="h4" size="xs" {...props} />,
                    a: (props) => (
                        <Link
                            onClick={() => help(props.href)}
                            color="blue.400"
                            {...props}
                        />
                    ),
                },
            }}
        />
    );
}
