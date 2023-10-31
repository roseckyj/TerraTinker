import {
    ChakraProvider,
    DarkMode,
    Theme,
    ThemeConfig,
    extendTheme,
} from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
import { ReactFlowProvider } from "reactflow";
import "reactflow/dist/style.css";
import { NodeGraph } from "./NodeGraph";
import "./index.css";
import { sampleData } from "./sampleData";
import { Data } from "./types/serializationTypes";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);

const config: ThemeConfig = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const stored = localStorage.getItem("data");
let data: Data;
if (!stored) {
    localStorage.setItem("data", JSON.stringify(sampleData));
    data = sampleData;
} else {
    data = JSON.parse(stored);
}

root.render(
    <ReactFlowProvider>
        <ChakraProvider
            theme={extendTheme({
                config,
            } as Theme)}
        >
            <DarkMode>
                <NodeGraph
                    data={data}
                    onSave={(data) =>
                        localStorage.setItem("data", JSON.stringify(data))
                    }
                />
            </DarkMode>
        </ChakraProvider>
    </ReactFlowProvider>
);
