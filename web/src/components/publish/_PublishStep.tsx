import { BiRocket } from "react-icons/bi";
import { Step } from "../Step";
import { WithHelp } from "../help/WithHelp";
import { MenuItem } from "../menu/MenuItem";
import { Publish } from "./Publish";

export const PublishStep: Step = (
    data,
    onDataChange,
    isSelected,
    onSelected
) => {
    return {
        menuItem: (key) => (
            <WithHelp path={`/publish`}>
                <MenuItem
                    key={key}
                    icon={<BiRocket />}
                    label="Publish"
                    selected={isSelected}
                    onClick={onSelected}
                />
            </WithHelp>
        ),
        window: (key) => <Publish key={key} data={data} hide={!isSelected} />,
    };
};
