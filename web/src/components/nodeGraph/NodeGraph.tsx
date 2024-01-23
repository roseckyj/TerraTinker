import { ReactFlowProvider } from "reactflow";
import { INodeGraphProps, NodeGraphComponent } from "./NodeGraphComponent";

export function NodeGraph(props: INodeGraphProps) {
    return (
        <ReactFlowProvider>
            <NodeGraphComponent {...props} />
        </ReactFlowProvider>
    );
}
