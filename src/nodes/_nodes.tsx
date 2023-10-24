import { ExampleNode } from "./ExampleNode";
import { AbstractNode } from "./_AbstractNode";

export const nodes: Array<
    new (id: string, position: { x: number; y: number }) => AbstractNode
> = [ExampleNode];
