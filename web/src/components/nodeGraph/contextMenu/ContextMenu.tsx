import {
    Box,
    Menu,
    MenuList,
    MenuListProps,
    MenuProps,
    Portal,
} from "@chakra-ui/react";
import { RefObject, useEffect, useRef, useState } from "react";

export interface IContextMenuProps {
    renderMenu: (
        position: { x: number; y: number } | null,
        close: () => void
    ) => JSX.Element;
    onContextMenu?: (e: React.MouseEvent) => void;
    onClose?: () => void;
    children: (
        ref: RefObject<HTMLElement>,
        onOpen: (x: number, y: number) => void
    ) => JSX.Element;
    darken?: boolean;
    menuProps?: Partial<MenuProps>;
    menuListProps?: Partial<MenuListProps>;
}

export function ContextMenu(props: IContextMenuProps) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState<{ x: number; y: number } | null>(
        null
    );
    const ref = useRef<HTMLElement>(null);

    const onOpen = (position: { x: number; y: number }) => {
        setOpen(true);
        setPosition(position);
        props.onContextMenu?.(position as any);
    };

    const onClose = () => {
        setOpen(false);
        props.onClose?.();
    };

    useEffect(() => {
        if (!ref || !ref.current) return;
        const current = ref.current;

        const handler = (e: MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            onOpen({ x: e.clientX, y: e.clientY });
        };

        current.addEventListener("contextmenu", handler);
        return () => current.removeEventListener("contextmenu", handler);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ref, ref.current]);

    return (
        <>
            <Portal>
                <Box
                    position="fixed"
                    zIndex="overlay"
                    inset={0}
                    pointerEvents={open ? "all" : "none"}
                    onContextMenu={(e) => {
                        e.preventDefault();
                        onClose();
                    }}
                    transition="background 0.2s ease"
                    bg={props.darken && open ? "blackAlpha.500" : "transparent"}
                >
                    <Menu
                        isOpen={open}
                        onClose={() => onClose()}
                        isLazy
                        {...(props.menuProps || {})}
                    >
                        {({ onClose: close }) => (
                            <MenuList
                                onAnimationEnd={(e) => {
                                    const menu =
                                        document.querySelector("[role=menu]")!;
                                    (menu as HTMLDivElement).focus();
                                }}
                                position="fixed"
                                py={0}
                                top={`${position?.y}px`}
                                left={`${position?.x}px`}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    onClose();
                                }}
                                {...(props.menuListProps || {})}
                            >
                                {props.renderMenu(position, close)}
                            </MenuList>
                        )}
                    </Menu>
                </Box>
            </Portal>
            {props.children(ref, (x, y) => onOpen({ x, y }))}
        </>
    );
}
