# TerraTinker Server

## Description

This is a Minecraft 1.18.2 Java plugin for the TerraTinker project.

## Prerequisities

### GDAL

This plugin requires GDAL to function correctly.

#### Windows

1. Download and install Python 2.7.
2. Download and install gdal-3.7.2-1930-x64-core.msi from [gisinternals.com](https://www.gisinternals.com/query.html?content=filelist&file=release-1930-x64-gdal-3-7-2-mapserver-8-0-1.zip).
    - Do not install MSSQLSpatial
3. Open and edit the following System Environment Variables in Advanced System Properties:

    ```
    Append to PATH
    - C:\Program Files\GDAL
    GDAL_DATA
    - C:\Program Files\GDAL\gdal-data
    GDAL_DRIVER_PATH
    - C:\Program Files\GDAL\gdalplugins
    ```

4. Test to see if GDAL is installed by opening Command Prompt and type in:

    ```
    gdalinfo --version
    ```

5. If GDAL thorws an error about missing `proj_9_3.dll`, you need to download and install GDAL also through OSGeo4W. Download the network installer from [OSGeo4W website](https://trac.osgeo.org/osgeo4w/)

6. Run the _Advanced Install_ and select `Libs/gdal`

7. Add the OSGeo4W bin folder to your path:

    ```
    C:\OSGeo4W\bin
    ```

8. Restart the server, terminal or PC if needed

9. Check GDAL again, it should now report the version
    ```
    gdalinfo --version
    ```

#### Linux, MAC

`apk --no-cache add java-gdal`

## Plugin usage

This plugin runs on **Paper server** (or it's forks) **version 1.20.0**. You can download the correct version from the [PaperMC website](https://papermc.io/).

The server will be unresponsive while running the command so I would strongly suggest increasing the timeout intervals in the server settings:

```
paper.yml
---

settings:
  watchdog:
    early-warning-every: 500000000
    early-warning-delay: 1000000000


spigot.yml
---

settings:
  timeout-time: 600000000
```

## Building

This project uses Gradle for dependency management and build automation. Make sure you have [Gradle](https://gradle.org/install/) installed on your system.

To build the project, navigate to the project directory and run:

```bash
gradle shadowJar
```

For testing purposes you can also run the server directly from Gradle:

```bash
gradle runServer
```
