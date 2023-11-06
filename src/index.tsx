import {
    ChakraProvider,
    DarkMode,
    Theme,
    ThemeConfig,
    extendTheme,
} from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { App } from "./components/App";
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

root.render(
    <ReactFlowProvider>
        <ChakraProvider
            theme={extendTheme({
                config,
            } as Theme)}
        >
            <DarkMode>
                <App />
            </DarkMode>
        </ChakraProvider>
    </ReactFlowProvider>
);
