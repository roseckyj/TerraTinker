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
import { BiSearch } from "react-icons/bi";
import { ReactFlowInstance } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import { forTime } from "waitasecond";
import { GraphState } from "../../graphState/graphState";
import { nodes as nodeDefs } from "../../nodes/_nodes";
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
                return (
                    <>
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
                                        const filtered = Object.entries(
                                            definitions
                                        )
                                            .map(([group, nodes]) =>
                                                nodes.filter(
                                                    (node) =>
                                                        search.length === 0 ||
                                                        node.title
                                                            .toLowerCase()
                                                            .includes(
                                                                search.toLowerCase()
                                                            ) ||
                                                        group
                                                            .toLowerCase()
                                                            .includes(
                                                                search.toLowerCase()
                                                            )
                                                )
                                            )
                                            .flat();

                                        if (filtered.length > 0) {
                                            createNode(
                                                filtered[0].type,
                                                position!
                                            );
                                            close();
                                        }
                                    }
                                }}
                            />
                        </InputGroup>
                        <Flex direction="column" overflowY="auto" maxH={64}>
                            {Object.entries(definitions)
                                .map(([group, nodes]) =>
                                    nodes
                                        .filter(
                                            (node) =>
                                                search.length === 0 ||
                                                node.title
                                                    .toLowerCase()
                                                    .includes(
                                                        search.toLowerCase()
                                                    ) ||
                                                group
                                                    .toLowerCase()
                                                    .includes(
                                                        search.toLowerCase()
                                                    )
                                        )
                                        .map((node) => ({ node, group }))
                                )
                                .flat()
                                .map(({ node, group }, i) => (
                                    <MenuItem
                                        key={i}
                                        py={1}
                                        px={2}
                                        _hover={{
                                            bg: "gray.200",
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
                                            {node.title}
                                            <Spacer />
                                            {i === 0 && <Kbd>Enter</Kbd>}
                                        </Flex>
                                    </MenuItem>
                                ))}
                        </Flex>
                    </>
                );
            }}
        >
            {children}
        </ContextMenu>
    );
}
