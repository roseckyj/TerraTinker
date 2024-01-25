import React, { useState } from "react";
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
                    onChange={(layer) => {
                        data.layers = data.layers.map((x) =>
                            x.id === layer.id ? layer : x
                        );
                        onDataChange(data);
                    }}
                />
            ) : (
                React.createElement(React.Fragment, { key })
            ),
    };
};
