import {
    Editable,
    EditablePreview,
    EditableTextarea,
    Flex,
} from "@chakra-ui/react";
import { useRef } from "react";
import { NodeProps } from "reactflow";
import {
    AbstractNode,
    NodeConstructorParams,
    NodeData,
} from "../../components/nodeGraph/AbstractNode";
import { GraphState } from "../../graphState/graphState";
import { Node } from "../../types/layerTypes";

export class CommentNode extends AbstractNode {
    static title = "Comment";
    static category = "Misc";
    static type = "comment";

    private content: string = "Comment";

    public constructor(params: NodeConstructorParams) {
        super({}, {}, params);
    }

    public static deserialize(id: string, node: Node) {
        const created = super.deserialize(id, node) as CommentNode;

        if (node.nodeData.content !== undefined) {
            created.content = node.nodeData.content;
        }

        return created;
    }

    public serializeNodeData(): Record<string, any> {
        return {
            content: this.content,
        };
    }

    public updateConnections(graphState: GraphState): void {
        super.updateConnections(graphState);
    }

    public static Component({
        data: { node, forceUpdate },
        selected,
    }: NodeProps<NodeData>) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const ref = useRef<HTMLSpanElement>(null);
        const thisNode = node as CommentNode;

        return (
            <Flex
                border="solid 1px #303030"
                bg="#1d1d1d"
                borderRadius="md"
                direction="column"
                alignItems="stretch"
                px={6}
                py={4}
                textColor="#888888"
                fontStyle="italic"
                maxW={96}
                shadow={selected ? "outline" : "none"}
            >
                <Editable
                    value={thisNode.content}
                    onChange={(value) => {
                        thisNode.content = value;
                        forceUpdate();
                    }}
                >
                    <EditablePreview ref={ref} />
                    <EditableTextarea
                        onPointerDown={(e) => e.stopPropagation()}
                        resize="vertical"
                        w="80"
                        h="64"
                    />
                </Editable>
            </Flex>
        );
    }
}
