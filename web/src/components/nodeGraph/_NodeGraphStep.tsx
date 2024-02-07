import React, { useCallback, useState } from "react";
import { Layer } from "../../types/layerTypes";
import { Step } from "../Step";
import { NodeGraph } from "./NodeGraph";
import { NodeGraphMenuItem } from "./NodeGraphMenuItem";

export const NodeGraphStep: Step = (
    data,
    onDataChange,
    isSelected,
    onSelected
) => {
    const [layerId, setLayerId] = useState<string>(data.layers[0].id);
    const onChange = useCallback(
        (layer: Layer) => {
            data.layers = data.layers.map((x) =>
                x.id === layer.id ? layer : x
            );
            onDataChange(data);
        },
        [data, onDataChange]
    );

    return {
        menuItem: (key) => (
            <NodeGraphMenuItem
                key={key}
                onClick={onSelected}
                selected={isSelected}
                data={data}
                onChange={onDataChange}
                layerId={layerId}
                onLayerIdChange={setLayerId}
            />
        ),
        window: (key) =>
            isSelected ? (
                <NodeGraph
                    key={layerId}
                    data={data.layers.find((x) => x.id === layerId)!}
                    onChange={onChange}
                />
            ) : (
                React.createElement(React.Fragment, { key })
            ),
    };
};
