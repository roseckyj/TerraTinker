import {
    Box,
    Button,
    ButtonGroup,
    ButtonProps,
    IconButton,
    IconButtonProps,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Portal,
    Tooltip,
    useDisclosure,
} from "@chakra-ui/react";

export interface IConfirmButtonProps
    extends Omit<ButtonProps | IconButtonProps, "type"> {
    type: "IconButton" | "Button";
    label: string;
    icon?: IconButtonProps["icon"];
    modalTitle: string;
    modalSubtitle?: string;
    onConfirm: () => void;
    onCancel?: () => void;
}

export const ConfirmButton = ({
    type,
    label,
    icon,
    modalTitle,
    modalSubtitle,
    onConfirm,
    onCancel,
    ...props
}: IConfirmButtonProps) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    const handleOpen = () => {
        if (!isOpen) {
            onOpen();
        }
    };

    return (
        <>
            <Popover
                returnFocusOnClose={false}
                isOpen={isOpen}
                onClose={handleCancel}
                closeOnBlur={true}
            >
                {type === "IconButton" ? (
                    <Tooltip label={label} hasArrow>
                        <Box display="inline-block">
                            <PopoverTrigger>
                                <IconButton
                                    {...props}
                                    icon={icon}
                                    onClick={handleOpen}
                                    aria-label={label}
                                />
                            </PopoverTrigger>
                        </Box>
                    </Tooltip>
                ) : (
                    <PopoverTrigger>
                        <Button {...props} leftIcon={icon} onClick={handleOpen}>
                            {label}
                        </Button>
                    </PopoverTrigger>
                )}
                <Portal>
                    <PopoverContent color="gray.100">
                        <PopoverHeader fontWeight="semibold">
                            {modalTitle}
                        </PopoverHeader>
                        <PopoverArrow />
                        {modalSubtitle && (
                            <PopoverBody>{modalSubtitle}</PopoverBody>
                        )}
                        <PopoverFooter display="flex" justifyContent="flex-end">
                            <ButtonGroup size="sm">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    colorScheme="red"
                                    onClick={handleConfirm}
                                >
                                    Confirm
                                </Button>
                            </ButtonGroup>
                        </PopoverFooter>
                    </PopoverContent>
                </Portal>
            </Popover>
        </>
    );
};
