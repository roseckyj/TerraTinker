import { Image, ImageProps } from "@chakra-ui/react";
import { mcTextures } from "../minecraft/mcData";

export interface ITextureProps extends ImageProps {
    material: string;
}

export function Texture({ material, ...rest }: ITextureProps) {
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
