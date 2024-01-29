import { BiShow } from "react-icons/bi";
import { Step } from "../Step";
import { WithHelp } from "../help/WithHelp";
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
            <WithHelp path={`/preview`} key={key}>
                <MenuItem
                    icon={<BiShow />}
                    label="Preview"
                    selected={isSelected}
                    onClick={onSelected}
                />
            </WithHelp>
        ),
        window: (key) => <Preview key={key} data={data} hide={!isSelected} />,
    };
};
