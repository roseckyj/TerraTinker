import { Box } from "@chakra-ui/react";

export function UpdateNodeDimensionTrigger({ version }: { version: number }) {
    return <Box h={`${(version / 10) % 5}px`} />;
}
