import { HStack, Text, VStack } from "@chakra-ui/react";

export interface IAbstractMenuItemProps {
    onClick: () => void;
    selected: boolean;
}

export interface IMenuItemProps {
    icon: JSX.Element;
    label: string;
    selected: boolean;
    onClick: () => void;
    children?: JSX.Element | JSX.Element[];
}

export function MenuItem({
    icon,
    label,
    onClick,
    selected,
    children,
}: IMenuItemProps): JSX.Element {
    return (
        <VStack
            borderBottomStyle="solid"
            borderBottomWidth={2}
            borderBottomColor="gray.800"
            bg={selected ? "blue.800" : undefined}
            alignItems="stretch"
        >
            <HStack
                px={6}
                py={4}
                alignItems="center"
                onClick={onClick}
                cursor="pointer"
            >
                {icon}
                <Text fontWeight="bold" flexGrow={1}>
                    {label}
                </Text>
            </HStack>
            {selected && children && (
                <VStack mt={2} px={6} mb={4} spacing={4} alignItems="stretch">
                    {children}
                </VStack>
            )}
        </VStack>
    );
}
