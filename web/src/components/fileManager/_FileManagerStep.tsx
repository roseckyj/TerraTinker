import { BiFolder } from "react-icons/bi";
import { Step } from "../Step";
import { MenuItem } from "../menu/MenuItem";
import { FileManager } from "./FileManager";

export const FileManagerStep: Step = (
    data,
    onDataChange,
    isSelected,
    onSelected
) => {
    return {
        menuItem: (
            <MenuItem
                icon={<BiFolder />}
                label="Manage files"
                selected={isSelected}
                onClick={onSelected}
            />
        ),
        window: <FileManager />,
    };
};
