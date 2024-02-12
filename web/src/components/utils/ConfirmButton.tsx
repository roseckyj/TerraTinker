import {
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

    return (
        <>
            <Popover
                returnFocusOnClose={false}
                isOpen={isOpen}
                onClose={handleCancel}
                closeOnBlur={true}
            >
                <PopoverTrigger>
                    {type === "IconButton" ? (
                        <IconButton
                            {...props}
                            icon={icon}
                            onClick={onOpen}
                            aria-label={label}
                        />
                    ) : (
                        <Button {...props} leftIcon={icon} onClick={onOpen}>
                            {label}
                        </Button>
                    )}
                </PopoverTrigger>
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
