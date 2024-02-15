#!/bin/bash
set -e

# CWD to server directory
cd $SERVER_HOME

# Check if EULA is accepted
if [ "$EULA" != "true" ]; then
    echo "Please set EULA=true indicating your agreement with Minecraft EULA (https://aka.ms/MinecraftEULA)"
    exit 1
fi

# Set environment variables for plugin directory and world directory
export PAPERMC_PLUGIN_DIR=$SERVER_HOME/plugins
export PAPERMC_WORLD_DIR=$SERVER_HOME/world

# Calculate version
if [ "$MINECRAFT_PATCH" = "0" ]; \
    then export MINECRAFT_VERSION=${MINECRAFT_MAJOR}.${MINECRAFT_MINOR}; \
    else export MINECRAFT_VERSION=${MINECRAFT_MAJOR}.${MINECRAFT_MINOR}.${MINECRAFT_PATCH}; \
fi 

# Download and run Minecraft server
./papermc.sh --mojang-eula-agree --version $MINECRAFT_VERSION --start-memory 1G --max-memory 10G --auto-restart
