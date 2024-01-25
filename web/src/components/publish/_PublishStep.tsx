import { BiRocket } from "react-icons/bi";
import { Step } from "../Step";
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
            <MenuItem
                key={key}
                icon={<BiRocket />}
                label="Publish"
                selected={isSelected}
                onClick={onSelected}
            />
        ),
        window: (key) => <Publish key={key} data={data} hide={!isSelected} />,
    };
};
