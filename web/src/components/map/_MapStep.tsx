import React, { useState } from "react";
import { Step } from "../Step";
import { Map } from "./Map";
import { MapMenuItem } from "./MapMenuItem";

export const MapStep: Step = (data, onDataChange, isSelected, onSelected) => {
    const [isSelecting, setIsSelecting] = useState(false);

    return {
        menuItem: (key) => (
            <MapMenuItem
                key={key}
                onClick={onSelected}
                selected={isSelected}
                data={data}
                onChange={onDataChange}
                isSelecting={isSelecting}
                onSelectionToggle={() => setIsSelecting(!isSelecting)}
            />
        ),
        window: (key) =>
            isSelected ? (
                <Map
                    key={key}
                    onSelectionToggle={() => setIsSelecting(!isSelecting)}
                    isSelecting={isSelecting}
                    data={data}
                    onChange={onDataChange}
                />
            ) : (
                React.createElement(React.Fragment, { key })
            ),
    };
};
