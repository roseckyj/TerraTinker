import {
    ComponentWithAs,
    IconButton,
    IconButtonProps,
    Tooltip,
} from "@chakra-ui/react";

export const IconButtonTooltip: ComponentWithAs<"button", IconButtonProps> = (
    props
) => {
    return (
        <Tooltip label={props["aria-label"]} hasArrow>
            <IconButton {...props} />
        </Tooltip>
    );
};
