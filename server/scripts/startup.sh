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

# Download and run Minecraft server
./papermc.sh --mojang-eula-agree --version 1.20 --start-memory 1G --max-memory 10G --auto-restart
