import { NodeConstructor } from "../components/AbstractNode";
import { ExampleNode } from "./ExampleNode";
import { BooleanOperatorNode } from "./boolean/BooleanOperatorNode";
import { ConstantBooleanNode } from "./boolean/ConstantBooleanNode";
import { NotNode } from "./boolean/NotNode";
import { SwitchNode } from "./conditional/SwitchNode";
import { ConstantMaterialNode } from "./material/ConstantMaterialNode";
import { MaterialByNameNode } from "./material/MaterialByNameNode";
import { MaterialScaleNode } from "./material/MaterialScaleNode";
import { ComparisonNode } from "./number/ComparisonNode";
import { ConstantNumberNode } from "./number/ConstantNumberNode";
import { MathNode } from "./number/MathNode";
import { ConstantStringNode } from "./string/ConstantStringNode";
import { ToStringNode } from "./string/ToStringNode";

export const nodes: Array<NodeConstructor> = [
    ConstantStringNode,
    ConstantNumberNode,
    ConstantBooleanNode,
    ConstantMaterialNode,
    ToStringNode,
    MaterialByNameNode,
    ExampleNode,
    MathNode,
    ComparisonNode,
    BooleanOperatorNode,
    NotNode,
    MaterialScaleNode,
    SwitchNode,
];
