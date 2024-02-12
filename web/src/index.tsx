import {
    ChakraProvider,
    DarkMode,
    Theme,
    ThemeConfig,
    extendTheme,
} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import ReactDOM from "react-dom/client";
import "reactflow/dist/style.css";
import { Api } from "./api/Api";
import { ApiProvider } from "./api/ApiProvider";
import { App } from "./components/App";
import { AppDataProvider } from "./components/DataProvider";
import { HelpProvider } from "./components/help/HelpProvider";
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const api = new Api();

root.render(
    <ChakraProvider
        theme={extendTheme({
            config,
            components: {
                Drawer: {
                    sizes: {
                        help: {
                            dialog: {
                                maxWidth: "1500px",
                            },
                        },
                    },
                },
            },
        } as any as Theme)}
    >
        <DarkMode>
            <AppDataProvider>
                <ApiProvider api={api}>
                    <HelpProvider>
                        <App />
                    </HelpProvider>
                </ApiProvider>
            </AppDataProvider>
        </DarkMode>
    </ChakraProvider>
);
