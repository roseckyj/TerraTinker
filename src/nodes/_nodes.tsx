import { NodeConstructor } from "../components/AbstractNode";
import { ExampleNode } from "./ExampleNode";
import { BooleanOperatorNode } from "./boolean/BooleanOperatorNode";
import { ConstantBooleanNode } from "./boolean/ConstantBooleanNode";
import { NotNode } from "./boolean/NotNode";
import { IsNullNode } from "./conditional/IsNullNode";
import { NullSwitchNode } from "./conditional/NullSwitchNode";
import { SwitchNode } from "./conditional/SwitchNode";
import { BoundingBoxNode } from "./geometry/BoundingBoxNode";
import { CreatePointNode } from "./geometry/CreatePointNode";
import { CreateRectangleNode } from "./geometry/CreateRectangleNode";
import { GeometryOverlapNode } from "./geometry/GeometryOverlapNode";
import { ConstantMaterialNode } from "./material/ConstantMaterialNode";
import { MaterialByNameNode } from "./material/MaterialByNameNode";
import { MaterialScaleNode } from "./material/MaterialScaleNode";
import { CommentNode } from "./misc/CommentNode";
import { ComparisonNode } from "./number/ComparisonNode";
import { ConstantNumberNode } from "./number/ConstantNumberNode";
import { MathNode } from "./number/MathNode";
import { RandomNumberNode } from "./number/RandomNumberNode";
import { ConstantStringNode } from "./string/ConstantStringNode";
import { ToStringNode } from "./string/ToStringNode";

export const nodes: Array<NodeConstructor> = [
    CommentNode,
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
    CreatePointNode,
    CreateRectangleNode,
    BoundingBoxNode,
    GeometryOverlapNode,
    IsNullNode,
    NullSwitchNode,
    RandomNumberNode,
];
