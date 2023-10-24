declare module "minecraft-assets" {
    export default function (version: string): {
        blocks: any;
        blocksArray: any;

        items: any;
        itemsArray: any;

        textureContent: any;
        textureContentArray: any;
    };
}
