// The method is actually a functional component. It is not a class component.
/* eslint-disable react-hooks/rules-of-hooks */

import { Box, Button, Spinner, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { BiFile, BiQuestionMark } from "react-icons/bi";
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

        console.log(status, localFileNode.fileId);

        return (
            <GenericNode
                title={ctor.title}
                category={ctor.category}
                selected={selected}
                locked={locked}
                w={64}
            >
                {!!localFileNode.fileId ? (
                    <UploadButton
                        size="lg"
                        variant="outline"
                        leftIcon={<BiFile />}
                        mb={2}
                        px={4}
                        onFile={onFile}
                    >
                        <Box w="full" textAlign="left">
                            <Await
                                for={fileInfo!}
                                loading={<Spinner />}
                                error={(error) => (
                                    <Text color="red.500">
                                        Error getting file info
                                    </Text>
                                )}
                            >
                                {(response) =>
                                    response.data.status === "ok" ? (
                                        response.data.data.filename
                                    ) : (
                                        <Text color="red.500">
                                            {response.data.message}
                                        </Text>
                                    )
                                }
                            </Await>
                        </Box>
                    </UploadButton>
                ) : status > 0 ? (
                    <Button
                        size="lg"
                        variant="outline"
                        leftIcon={<Spinner />}
                        mb={2}
                        px={4}
                    >
                        {Math.floor(status * 100)}%
                    </Button>
                ) : (
                    <UploadButton
                        size="lg"
                        variant="outline"
                        leftIcon={<BiQuestionMark />}
                        mb={2}
                        px={4}
                        onFile={onFile}
                    >
                        <Box w="full" textAlign="left">
                            Select file
                        </Box>
                    </UploadButton>
                )}
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
