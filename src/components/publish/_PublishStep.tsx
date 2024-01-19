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
        menuItem: (
            <MenuItem
                icon={<BiRocket />}
                label="Publish"
                selected={isSelected}
                onClick={onSelected}
            />
        ),
        window: <Publish data={data} hide={!isSelected} />,
    };
};
