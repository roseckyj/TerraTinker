import { BiSearch } from "react-icons/bi";
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
        menuItem: (
            <MenuItem
                icon={<BiSearch />}
                label="Preview"
                selected={isSelected}
                onClick={onSelected}
            />
        ),
        window: <Preview data={data} hide={!isSelected} />,
    };
};
