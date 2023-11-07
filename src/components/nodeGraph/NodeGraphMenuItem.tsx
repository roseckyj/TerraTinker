import { BiLayer } from "react-icons/bi";
import { IAbstractMenuItemProps, MenuItem } from "../menu/MenuItem";

export function NodeGraphMenuItem({
    onClick,
    selected,
}: IAbstractMenuItemProps) {
    return (
        <MenuItem
            icon={<BiLayer />}
            label="Create layers"
            onClick={onClick}
            selected={selected}
        ></MenuItem>
    );
}
