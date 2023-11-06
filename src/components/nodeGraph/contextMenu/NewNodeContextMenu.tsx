import {
    Flex,
    Input,
    InputGroup,
    InputLeftElement,
    Kbd,
    MenuItem,
    Spacer,
    Text,
} from "@chakra-ui/react";
import { RefObject, useMemo, useRef, useState } from "react";
import { BiHistory, BiSearch } from "react-icons/bi";
import { ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { forTime } from "waitasecond";
import { GraphState } from "../../../graphState/graphState";
import { nodes as nodeDefs } from "../../../nodes/_nodes";
import { AbstractNode, NodeConstructor } from "../AbstractNode";
import { ContextMenu } from "./ContextMenu";

export interface INewNodeContextMenuProps {
    children: (ref: RefObject<HTMLElement>) => JSX.Element;
    reactFlow: ReactFlowInstance;
    graphState: {
        graphState: GraphState;
        updateConnections: (graphState: GraphState) => void;
        forceUpdate: () => void;
    };
}

export function NewNodeContextMenu({
    children,
    reactFlow,
    graphState: { graphState, updateConnections, forceUpdate },
}: INewNodeContextMenuProps) {
    const ref = useRef<HTMLInputElement>(null);
    const [search, setSearch] = useState("");
    const definitions = useMemo(
        () =>
            nodeDefs.reduce(
                (prev, value) => {
                    const stat = value as any as typeof AbstractNode;
                    if (!prev[stat.category]) {
                        prev[stat.category] = [];
                    }
                    prev[stat.category].push({
                        title: stat.title,
                        type: stat.type,
                    });
                    return prev;
                },
                {} as Record<
                    string,
                    {
                        title: string;
                        type: string;
                    }[]
                >
            ),
        []
    );

    const createNode = (type: string, position: { x: number; y: number }) => {
        const newNode = new (nodeDefs.find(
            (value) => (value as any).type === type
        ) as NodeConstructor)({
            id: uuidv4(),
            position: reactFlow.project(position!),
        });
        graphState.nodes.push(newNode);
        updateConnections(graphState);
        forceUpdate();

        // Save last used nodes to localstorage
        let lastUsed = JSON.parse(
            localStorage.getItem("lastUsedNodes") || "[]"
        );
        lastUsed.unshift(type);
        lastUsed = lastUsed.slice(0, 3);
        localStorage.setItem("lastUsedNodes", JSON.stringify(lastUsed));
        return newNode;
    };

    return (
        <ContextMenu
            menuListProps={{
                w: 80,
            }}
            onClose={() => setSearch("")}
            onContextMenu={async () => {
                await forTime(10);
                ref.current?.focus();
            }}
            renderMenu={(position, close) => {
                // Load last used nodes from localstorage
                const lastUsed: string[] = (
                    JSON.parse(
                        localStorage.getItem("lastUsedNodes") || "[]"
                    ) as string[]
                ).reverse();

                const nodes = Object.entries(definitions)
                    .map(([group, nodes]) =>
                        nodes
                            .filter(
                                (node) =>
                                    search.length === 0 ||
                                    node.title
                                        .toLowerCase()
                                        .includes(search.toLowerCase()) ||
                                    group
                                        .toLowerCase()
                                        .includes(search.toLowerCase())
                            )
                            .map((node) => ({
                                node,
                                group,
                                lastUsed: lastUsed.includes(node.type),
                            }))
                    )
                    .flat()
                    // Sort last used on the top
                    .sort(
                        (a, b) =>
                            lastUsed.indexOf(b.node.type) -
                            lastUsed.indexOf(a.node.type)
                    );

                return (
                    <Flex direction="column" alignItems="stretch" color="white">
                        <InputGroup variant="filled">
                            <InputLeftElement pointerEvents="none">
                                <BiSearch />
                            </InputLeftElement>
                            <Input
                                autoFocus
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onBlur={() => ref.current?.focus()}
                                ref={ref}
                                tabIndex={0}
                                type="text"
                                placeholder="Search"
                                borderBottomRadius={0}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        const filtered = nodes;

                                        if (filtered.length > 0) {
                                            createNode(
                                                filtered[0].node.type,
                                                position!
                                            );
                                            close();
                                        }
                                    }
                                }}
                            />
                        </InputGroup>
                        <Flex direction="column" overflowY="auto" maxH={64}>
                            {nodes.map(({ node, group, lastUsed }, i) => (
                                <MenuItem
                                    key={i}
                                    py={1}
                                    px={2}
                                    _hover={{
                                        bg: "gray.600",
                                    }}
                                    onClick={() =>
                                        createNode(node.type, position!)
                                    }
                                >
                                    <Flex
                                        direction="row"
                                        alignItems="center"
                                        w="full"
                                    >
                                        <Text opacity={0.5}>
                                            {group}&nbsp;&gt;
                                        </Text>
                                        &nbsp;
                                        <Text
                                            whiteSpace="nowrap"
                                            overflow="hidden"
                                            textOverflow="ellipsis"
                                        >
                                            {node.title}
                                        </Text>
                                        <Spacer />
                                        {i === 0 && <Kbd mr={2}>Enter</Kbd>}
                                        {lastUsed && <BiHistory />}
                                    </Flex>
                                </MenuItem>
                            ))}
                        </Flex>
                    </Flex>
                );
            }}
        >
            {children}
        </ContextMenu>
    );
}
