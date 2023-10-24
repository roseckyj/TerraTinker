import { Box } from "@chakra-ui/react";
import { Position } from "reactflow";
import {
    HandleDefinition,
    InputState,
    OutputState,
} from "../nodes/_AbstractNode";
import { TypedHandle } from "./TypedHandle";

export const separator = "___";

export type IVariableProps = {
    param: string;
    definition: HandleDefinition;
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
}: IVariableProps) {
    if (orientation === "output") {
        // Right
        return (
            <Box px={4} py={1} position="relative" textAlign="right" minW={40}>
                {definition.title}
                <TypedHandle
                    id={param}
                    position={Position.Right}
                    isConnectable={true}
                    varType={definition.type}
                    nullable={state.nullable}
                    value={null}
                    onChange={(value) => onChange && onChange(value)}
                />
            </Box>
        );
    } else {
        // Left
        return (
            <Box px={4} py={1} position="relative" minW={40}>
                {definition.title}
                <TypedHandle
                    id={param}
                    position={Position.Left}
                    isConnectable={true}
                    varType={definition.type}
                    connected={!!state.nodeId}
                    nullable={state.nullable}
                    value={state.value}
                    onChange={(value) => onChange && onChange(value)}
                />
            </Box>
        );
    }
}
