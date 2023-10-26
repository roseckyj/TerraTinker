import { GraphState } from "./graphState/graphState";

export function useUpdateConnections() {
    return (graphState: GraphState) => {
        try {
            const unvisited = new Set(graphState.nodes.map((node) => node.id));
            const processing = new Set<string>();

            const visitNode = (nodeId: string) => {
                if (processing.has(nodeId)) {
                    throw new Error(
                        `Circular dependency detected at node ${nodeId}`
                    );
                }
                processing.add(nodeId);

                const node = graphState.nodes.find(
                    (node) => node.id === nodeId
                )!;

                Object.entries(node.inputState)
                    .filter(([key, input]) => input.nodeId)
                    .forEach(([key, input]) => {
                        const sourceNode = graphState.nodes.find(
                            (node) => node.id === input.nodeId
                        )!;
                        if (unvisited.has(sourceNode.id)) {
                            visitNode(sourceNode.id);
                        }
                    });

                node.updateConnections(graphState);

                unvisited.delete(nodeId);
                processing.delete(nodeId);
            };

            while (unvisited.size > 0) {
                const nodeId = unvisited.values().next().value;
                visitNode(nodeId);
            }
        } catch (e) {
            console.warn(e);
            return false;
        }
        return true;
    };
}
