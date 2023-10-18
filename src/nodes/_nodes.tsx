import { Node, VarType } from "../types/graphTypes";
import { constant } from "./constant.area";
import { contains } from "./geometry.contains";
import { csvInput } from "./input.csv";
import { shapeInput } from "./input.shp";
import { concatenate } from "./string.concatenate";

export type HandlesDefinition = (node: Node) => Record<
    string,
    {
        nullable?: boolean;
        type: VarType;
        title: string;
    }
>;

export type NodeDefinition = {
    component: React.ComponentType<any>;
    title: string;
    category: string;
    inputs: HandlesDefinition;
    outputs: HandlesDefinition;
};

export const nodes: Record<string, NodeDefinition> = {
    "constant.area": constant,
    "string.concatenate": concatenate,
    "geometry.contains": contains,
    "input.csv": csvInput,
    "input.shp": shapeInput,
};
