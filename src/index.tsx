import {
    ChakraProvider,
    Theme,
    ThemeConfig,
    extendTheme,
} from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import "reactflow/dist/style.css";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

root.render(
    <React.StrictMode>
        <ChakraProvider
            theme={extendTheme({
                config,
            } as Theme)}
        >
            <App />
        </ChakraProvider>
    </React.StrictMode>
);
