// The method is actually a functional component. It is not a class component.
/* eslint-disable react-hooks/rules-of-hooks */

import {
    Box,
    Button,
    HStack,
    IconButton,
    Menu,
    MenuButton,
    MenuItemOption,
    MenuList,
    MenuOptionGroup,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BiFolderOpen, BiUpload } from "react-icons/bi";
import { NodeProps } from "reactflow";
import { useApi } from "../../api/ApiProvider";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GenericNode } from "../../components/nodeGraph/GenericNode";
import { Variable } from "../../components/nodeGraph/Variable";
import { Await } from "../../components/utils/Await";
import { UploadButton } from "../../components/utils/uploadButton";
import { GraphState } from "../../graphState/graphState";
import { Node } from "../../types/layerTypes";

const LOCALSTORAGE_KEY = "localFileNode_history";

type LocalFileNodeData = {
    id: string;
    name: string;
};

export class LocalFileNode extends AbstractNode {
    static title = "Local File";
    static category = "Loaders";
    static type = "localFile";

    fileId: string | null = null;

    public constructor(params: NodeConstructorParams) {
        super(
            {},
            {
                path: {
                    type: "string",
                    title: "Path",
                },
            },
            params
        );
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as LocalFileNode;

        if (node.nodeData.fileId) {
            created.fileId = node.nodeData.fileId;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            fileId: this.fileId,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);

        this.outputState.path.nullable = this.fileId === null;
    }

    public static Component({
        data: { node, forceUpdate, locked },
        selected,
    }: NodeProps<NodeData>) {
        const ctor = node.constructor as typeof LocalFileNode;
        const localFileNode = node as LocalFileNode;

        const api = useApi();
        const [status, setStatus] = useState(
            localFileNode.fileId === null ? 0 : 1
        );

        const [history, setHistory] = useState<LocalFileNodeData[]>(() => {
            const stored = localStorage.getItem(LOCALSTORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
            return [];
        });

        const onFile = async (file: File) => {
            if (!file) return;

            setStatus(0);
            localFileNode.fileId = null;
            forceUpdate();

            const response = await api.uploadFile(
                file,
                "/files/upload",
                (progress) => {
                    setStatus(progress.progress || 0);
                }
            );
            if (response.status === 200) {
                const fileId = await response.data.data.uuid;
                localFileNode.fileId = fileId;
                setStatus(1);
                forceUpdate();
            }
        };

        const fileInfo = useMemo(() => {
            if (localFileNode.fileId === null) return null;
            return api.get("/files/" + localFileNode.fileId);
        }, [localFileNode.fileId, api]);

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
                w={64}
                helpPath="/nodes/loader/localFile"
            >
                <Box
                    mb={2}
                    py={2}
                    px={2}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                >
                    {fileInfo ? (
                        <Await
                            for={fileInfo!}
                            loading={<Text>Fetching file info</Text>}
                            error={(error) => (
                                <Text color="red.500">
                                    Error getting file info
                                </Text>
                            )}
                        >
                            {(response) => {
                                if (response && response.data.status === "ok") {
                                    // Add to history
                                    const fileData = response.data.data;
                                    if (
                                        !history.some(
                                            (f) => f.id === fileData.uuid
                                        )
                                    ) {
                                        const newHistory = [
                                            ...history,
                                            {
                                                id: fileData.uuid,
                                                name: fileData.filename,
                                            },
                                        ];

                                        setHistory(newHistory);
                                        localStorage.setItem(
                                            LOCALSTORAGE_KEY,
                                            JSON.stringify(newHistory)
                                        );
                                    }

                                    return response.data.data.filename;
                                } else {
                                    return (
                                        <Text color="red.500">
                                            {response
                                                ? response.data.message
                                                : "Network error"}
                                        </Text>
                                    );
                                }
                            }}
                        </Await>
                    ) : (
                        <Text color="red.500">No file selected</Text>
                    )}
                </Box>
                <HStack px={2} mb={4}>
                    {status > 0 && status < 1 ? (
                        <Button
                            size="lg"
                            leftIcon={<Spinner />}
                            px={4}
                            flexGrow={1}
                        >
                            {Math.floor(status * 100)}%
                        </Button>
                    ) : (
                        <UploadButton
                            size="lg"
                            leftIcon={<BiUpload />}
                            px={4}
                            onFile={onFile}
                            flexGrow={1}
                        >
                            <Box w="full" textAlign="left">
                                Upload
                            </Box>
                        </UploadButton>
                    )}
                    {history.length > 0 && (
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                icon={<BiFolderOpen />}
                                aria-label="Browse"
                                size="lg"
                            >
                                Actions
                            </MenuButton>
                            <MenuList maxW={96}>
                                {history.map((file, i) => (
                                    <MenuOptionGroup
                                        value={
                                            localFileNode.fileId || undefined
                                        }
                                    >
                                        <MenuItemOption
                                            key={i}
                                            value={file.id}
                                            onClick={() => {
                                                localFileNode.fileId = file.id;
                                                forceUpdate();
                                            }}
                                        >
                                            <Text
                                                whiteSpace="nowrap"
                                                overflow="hidden"
                                                textOverflow="ellipsis"
                                            >
                                                {file.name}
                                            </Text>
                                        </MenuItemOption>
                                    </MenuOptionGroup>
                                ))}
                            </MenuList>
                        </Menu>
                    )}
                </HStack>
                {Object.entries(node.outputs).map(([id, output]) => (
                    <Variable
                        key={id}
                        orientation="output"
                        param={id}
                        definition={output}
                        state={node.outputState[id]}
                        locked={locked}
                    />
                ))}
            </GenericNode>
        );
    }
}
