import { Position } from "./genericTypes";

export type NodeId = string;
export type OutputId = string;
export type InputId = string;
export type VarType =
    | "geometry"
    | "float"
    | "string"
    | "material"
    | "boolean"
    | "raster";

export type Layer = {
    config: {
        join: "cartesian" | "primaryOuter";
        /* ... */
    };
    flow: {
        nodes: Array<NodeId>;
        startLocation: Position;
    };
    nodes: Record<NodeId, Node>;
};

export type Node = {
    type: string;
    location: Position;
    inputs: Record<InputId, Input>;
    nodeData: Record<string, any>;
};

export type Input =
    | {
          kind: "link";
          node: NodeId;
          output: OutputId;
      }
    | {
          kind: "value";
          type: "float";
          value: number;
      }
    | {
          kind: "value";
          type: "string";
          value: string;
      }
    | {
          kind: "value";
          type: "material";
          value: string;
      }
    | {
          kind: "value";
          type: "boolean";
          value: boolean;
      }
    | {
          kind: "value";
          type: "geometry";
          value: null;
      };
