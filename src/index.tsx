import {
    ChakraProvider,
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
            <NodeGraph data={sampleData} onSave={(data) => console.log(data)} />
        </ChakraProvider>
    </ReactFlowProvider>
);
