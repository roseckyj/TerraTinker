import { BiShow } from "react-icons/bi";
import { Step } from "../Step";
import { MenuItem } from "../menu/MenuItem";
import { Preview } from "./Preview";

export const PreviewStep: Step = (
    data,
    onDataChange,
    isSelected,
    onSelected
) => {
    return {
        menuItem: (key) => (
            <MenuItem
                key={key}
                icon={<BiShow />}
                label="Preview"
                selected={isSelected}
                onClick={onSelected}
            />
        ),
        window: (key) => <Preview key={key} data={data} hide={!isSelected} />,
    };
};
