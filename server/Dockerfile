FROM gradle:8.5.0-jdk17-alpine

# Configure the locations
ENV APP_HOME=/app
ENV SERVER_HOME=${APP_HOME}/server
ENV PLUGIN_HOME=${APP_HOME}/plugin

# Expose the server api port
EXPOSE 7070

# Install dependencies
RUN apk update && apk --no-cache add curl java-gdal proj proj-dev jq bash

# Setup the build environment
RUN mkdir -p ${PLUGIN_HOME}
WORKDIR ${PLUGIN_HOME}
COPY . ${PLUGIN_HOME}

# Set the version of the minecraft server
ARG MINECRAFT_MAJOR
ARG MINECRAFT_MINOR
ARG MINECRAFT_PATCH
ENV MINECRAFT_MAJOR $MINECRAFT_MAJOR
ENV MINECRAFT_MINOR $MINECRAFT_MINOR
ENV MINECRAFT_PATCH $MINECRAFT_PATCH

# Build the plugin
RUN gradle shadowJar --no-daemon

# Create files for the server
RUN mkdir -p ${SERVER_HOME}
WORKDIR ${SERVER_HOME}
RUN mkdir -p ${SERVER_HOME}/plugins
RUN mv ${PLUGIN_HOME}/build/libs/TerraTinker.jar ${SERVER_HOME}/plugins
COPY ./config ${SERVER_HOME}

# Copy the scripts
WORKDIR ${APP_HOME}
COPY ./scripts ${APP_HOME}

# Download PaperMC shell script
WORKDIR ${SERVER_HOME}
RUN curl -s -o papermc.sh https://raw.githubusercontent.com/TigerdieKatze/PaperMC.sh/master/papermc.sh
RUN chmod +x papermc.sh

# Run the startup script
WORKDIR ${APP_HOME}
RUN chmod +x startup.sh
ENTRYPOINT ["bash", "startup.sh"]