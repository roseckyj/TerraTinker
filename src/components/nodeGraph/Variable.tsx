import { Box } from "@chakra-ui/react";
import { Position } from "reactflow";
import { HandleDefinition, InputState, OutputState } from "./AbstractNode";
import { TypedHandle } from "./TypedHandle";

export const separator = "___";

export type IVariableProps = {
    param: string;
    definition: HandleDefinition;
    locked: boolean;
    onChange?: (value: any) => void;
} & (
    | {
          orientation: "input";
          state: InputState;
      }
    | {
          orientation: "output";
          state: OutputState;
      }
);

export function Variable({
    param,
    definition,
    onChange,
    orientation,
    state,
    locked,
}: IVariableProps) {
    if (orientation === "output") {
        // Right
        return (
            <Box py={1} px={2} position="relative" textAlign="right" minW={40}>
                {definition.title}
                <TypedHandle
                    id={param}
                    position={Position.Right}
                    isConnectable={!locked}
                    varType={definition.type}
                    nullable={state.nullable}
                    value={null}
                    locked={locked}
                    onChange={(value) => !locked && onChange && onChange(value)}
                />
            </Box>
        );
    } else {
        // Left
        return (
            <Box py={1} px={2} position="relative" minW={40}>
                {definition.title}
                <TypedHandle
                    id={param}
                    position={Position.Left}
                    isConnectable={!locked}
                    varType={definition.type}
                    connected={!!state.nodeId}
                    nullable={state.nullable}
                    value={state.value}
                    locked={locked}
                    onChange={(value) => !locked && onChange && onChange(value)}
                />
            </Box>
        );
    }
}
