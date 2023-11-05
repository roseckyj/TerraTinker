import { Box, Image, ImageProps, Text } from "@chakra-ui/react";
import { mcTextures } from "../minecraft/mcData";

export interface ITextureProps extends ImageProps {
    material: string;
    showText?: boolean;
}

export function Texture({ material, showText, ...rest }: ITextureProps) {
    if (showText && !(mcTextures as any)[`minecraft:${material}`]) {
        return (
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                {...rest}
            >
                <Text
                    fontSize="0.5rem"
                    color="whiteAlpha.500"
                    fontStyle="italic"
                    overflow="hidden"
                >
                    {material.split("_").join(" ")}
                </Text>
            </Box>
        );
    }

    return (
        <Image
            src={
                (mcTextures as any)[`minecraft:${material}`]
                    ? (mcTextures as any)[`minecraft:${material}`]?.texture
                    : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=" /* Transparent pixel */
            }
            {...rest}
        />
    );
}
