import { Box, Flex, IconButton, Portal } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRef } from "react";
import { BiBookOpen } from "react-icons/bi";
import { useHelp } from "./HelpProvider";

export interface IWithHelpProps {
    path: string;
    children: JSX.Element | JSX.Element[];
}

export const WithHelp = observer(({ children, path }: IWithHelpProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const help = useHelp();

    const bbox = ref.current?.getBoundingClientRect();
    const PADDING = 0;

    return (
        <>
            <Box data-help={path} ref={ref}>
                {children}
            </Box>
            {help.helpOverlay && bbox && (
                <Portal>
                    <Flex
                        position="fixed"
                        top={Math.max(bbox.top - PADDING, 0) + "px"}
                        left={Math.max(bbox.left - PADDING, 0) + "px"}
                        width={bbox.width + 2 * PADDING + "px"}
                        height={bbox.height + 2 * PADDING + "px"}
                        borderRadius="lg"
                        borderWidth={4}
                        borderColor="blue.300"
                        background="rgb(99, 179, 237, 0.3)"
                        zIndex="overlay"
                        px={2}
                        py={bbox.height > 60 ? 2 : 0}
                        justifyContent="end"
                        alignItems={bbox.height > 60 ? "start" : "center"}
                    >
                        <IconButton
                            aria-label="Open help here"
                            icon={<BiBookOpen />}
                            onClick={() => {
                                help.onOpen(path);
                                help.toggleHelpOverlay();
                            }}
                            colorScheme="blue"
                            cursor="help"
                        />
                    </Flex>
                </Portal>
            )}
        </>
    );
});
