import { useState } from "react";
import { Step } from "../Step";
import { Map } from "./Map";
import { MapMenuItem } from "./MapMenuItem";

export const MapStep: Step = (data, onDataChange, isSelected, onSelected) => {
    const [isSelecting, setIsSelecting] = useState(false);

    return {
        menuItem: (
            <MapMenuItem
                onClick={onSelected}
                selected={isSelected}
                data={data}
                onChange={onDataChange}
                isSelecting={isSelecting}
                onSelectionToggle={() => setIsSelecting(!isSelecting)}
            />
        ),
        window: isSelected ? (
            <Map
                onSelectionToggle={() => setIsSelecting(!isSelecting)}
                isSelecting={isSelecting}
                data={data}
                onChange={onDataChange}
            />
        ) : (
            <></>
        ),
    };
};
