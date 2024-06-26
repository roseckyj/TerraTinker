import { NodeConstructor } from "../components/nodeGraph/AbstractNode";
import { BooleanOperatorNode } from "./boolean/BooleanOperatorNode";
import { ConstantBooleanNode } from "./boolean/ConstantBooleanNode";
import { NotNode } from "./boolean/NotNode";
import { ForceNotNullNode } from "./conditional/ForceNotNullNode";
import { IsNullNode } from "./conditional/IsNullNode";
import { NullNode } from "./conditional/NullNode";
import { NullSwitchNode } from "./conditional/NullSwitchNode";
import { SwitchNode } from "./conditional/SwitchNode";
import { AltitudeToYNode } from "./geometry/AltitudeToYNode";
import { BlocksToMetersNode } from "./geometry/BlocksToMetersNode";
import { BoundingBoxNode } from "./geometry/BoundingBoxNode";
import { CreatePointNode } from "./geometry/CreatePointNode";
import { CreateRectangleNode } from "./geometry/CreateRectangleNode";
import { GeometryOverlapNode } from "./geometry/GeometryOverlapNode";
import { HeightToYNode } from "./geometry/HeightToYNode";
import { MetersToBlocksNode } from "./geometry/MetersToBlocksNode";
import { RasterizeNode } from "./geometry/RasterizeNode";
import { SelectedRegionNode } from "./geometry/SelectedRegionNode";
import { YToAltitudeNode } from "./geometry/YToAltitudeNode";
import { YToHeightNode } from "./geometry/YToHeightNode";
import { EsriLoaderNode } from "./loaders/EsriLoaderNode";
import { GeoJsonLoaderNode } from "./loaders/GeoJsonLoaderNode";
import { GeoTiffLoaderNode } from "./loaders/GeoTiffLoaderNode";
import { LocalFileNode } from "./loaders/LocalFileNode";
import { OsmLoaderNode } from "./loaders/OsmLoaderNode";
import { ConstantMaterialNode } from "./material/ConstantMaterialNode";
import { MaterialByNameNode } from "./material/MaterialByNameNode";
import { MaterialScaleNode } from "./material/MaterialScaleNode";
import { FillNode } from "./minecraft/FillNode";
import { HighestBlockAtNode } from "./minecraft/HighestBlockAtNode";
import { PlaceTreeNode } from "./minecraft/PlaceTreeNode";
import { ReplaceNode } from "./minecraft/ReplaceNode";
import { SetBlockNode } from "./minecraft/SetBlockNode";
import { WorldInfoNode } from "./minecraft/WorldInfoNode";
import { CommentNode } from "./misc/CommentNode";
import { LogNode } from "./misc/LogNode";
import { ComparisonNode } from "./number/ComparisonNode";
import { ConstantNumberNode } from "./number/ConstantNumberNode";
import { MathNode } from "./number/MathNode";
import { RandomNumberNode } from "./number/RandomNumberNode";
import { SequenceNode } from "./number/SequenceNode";
import { AggregateRasterNode } from "./raster/AggregateRasterNode";
import { RasterInfoNode } from "./raster/RasterInfoNode";
import { SampleRasterNode } from "./raster/SampleRasterNode";
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
    // ExampleNode,
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
    SampleRasterNode,
    AggregateRasterNode,
    SelectedRegionNode,
    FillNode,
    SetBlockNode,
    ReplaceNode,
    HighestBlockAtNode,
    ForceNotNullNode,
    RasterizeNode,
    NullNode,
    PlaceTreeNode,
    WorldInfoNode,
    GeoTiffLoaderNode,
    GeoJsonLoaderNode,
    EsriLoaderNode,
    OsmLoaderNode,
    LocalFileNode,
    SequenceNode,
    LogNode,
    BlocksToMetersNode,
    MetersToBlocksNode,
    YToAltitudeNode,
    AltitudeToYNode,
    YToHeightNode,
    HeightToYNode,
    RasterInfoNode,
];
