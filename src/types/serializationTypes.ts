export type NodeId = string;
export type OutputId = string;
export type InputId = string;
export type VarType = "geometry" | "float" | "string" | "material" | "boolean";

export type Data = {
    config: {
        join: "cartesian" | "primaryOuter";
        /* ... */
    };
    nodes: Record<NodeId, Node>;
};

export type Node = {
    type: string;
    location: [number, number];
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
