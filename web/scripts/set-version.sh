#!/bin/bash
set -e

if [ "$MINECRAFT_PATCH" = "0" ]; \
    then export MINECRAFT_VERSION=${MINECRAFT_MAJOR}.${MINECRAFT_MINOR}; \
    else export MINECRAFT_VERSION=${MINECRAFT_MAJOR}.${MINECRAFT_MINOR}.${MINECRAFT_PATCH}; \
fi 

echo "" > "src/minecraft/mcData.ts"
echo "export { default as mcData } from 'minecraft-data/minecraft-data/data/pc/$MINECRAFT_VERSION/blocks.json';" >> "src/minecraft/mcData.ts"
echo "export { default as mcTextures } from 'minecraft-textures/dist/textures/json/$MINECRAFT_MAJOR.$MINECRAFT_MINOR.id.json';" >> "src/minecraft/mcData.ts"
echo "export const mcVersion = '$MINECRAFT_VERSION';" >> "src/minecraft/mcData.ts"