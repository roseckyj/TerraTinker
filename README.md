# TerraTinker

TerraTinker is a node-based tool for visualizations of geospatial data.

## Usage

This project uses Docker and Docker Compose to run the application. To start the application, run the following command:

```bash
docker compose up
```

Before running the application you need to agree to [Minecraft EULA](https://aka.ms/MinecraftEULA). To do so you need to create a file `.env` in the root of the project by copying the `example.env` file and changing the value of `EULA` to `true`.

## Development

Guide to setup of each part of the project is in it's respective README.md file.

-   [Web](./web/README.md)
-   [Server](./server/README.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
