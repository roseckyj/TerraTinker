import { Menu, MenuItem, MenuItemProps, MenuList } from "@chakra-ui/react";
import { useRef, useState } from "react";

export interface ISubMenuProps extends MenuItemProps {
    title: string;
}

export function SubMenu({ title, children, ...rest }: ISubMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLElement>(null);
    const yOffset = 8; // Chakra: 2

    return (
        <MenuItem
            ref={ref}
            onClick={() => {
                setOpen(!open);
            }}
            closeOnSelect={false}
            {...rest}
        >
            {title}
            {ref.current && (
                <Menu isOpen={open}>
                    <MenuList
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onAnimationEnd={(e) => {
                            const menu = document.querySelector("[role=menu]")!;
                            (menu as HTMLDivElement).focus();
                        }}
                        position="fixed"
                        left={`${
                            ref.current.getBoundingClientRect().x +
                            ref.current.getBoundingClientRect().width
                        }px`}
                        top={`${
                            ref.current.getBoundingClientRect().y - yOffset
                        }px`}
                    >
                        {children}
                    </MenuList>
                </Menu>
            )}
        </MenuItem>
    );
}
