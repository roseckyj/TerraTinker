import { Data } from "./types/graphTypes";

export const sampleData: Data = {
    config: {
        join: "cartesian",
        /* ... */
    },
    nodes: {
        adbk4s5df5: {
            type: "constant.area",
            location: [-400, 0],
            inputs: {},
            nodeData: {},
        },
        "465sdf5sdf": {
            type: "string.concatenate",
            location: [-200, 0],
            inputs: {
                str1: {
                    kind: "value",
                    type: "string",
                    value: "http://test.com/",
                },
                str2: {
                    kind: "link",
                    node: "adbk4s5df5",
                    output: "startLat",
                },
                str3: { kind: "value", type: "string", value: ".shp" },
            },
            nodeData: {
                numInputs: 3,
            },
        },
        "5sdf54ssdf": {
            type: "input.shp",
            location: [0, 0],
            inputs: {
                path: { kind: "link", node: "465sdf5sdf", output: "out" },
            },
            nodeData: {
                primary: true,
                columns: {
                    geometry: "geometry",
                    height: "float",
                    roofHeight: "float",
                    roofType: "string",
                },
            },
        },
        s4d8f54sd5: {
            type: "input.csv",
            location: [0, 400],
            inputs: {
                path: {
                    kind: "value",
                    type: "string",
                    value: "http://test.com/qol.csv",
                },
            },
            nodeData: {
                primary: false,
                columns: {
                    geometry: "geometry",
                    qualityOfLife: "float",
                },
            },
        },
        sd4fs4df4d: {
            type: "geometry.contains",
            location: [400, 200],
            inputs: {
                haystack: {
                    kind: "link",
                    node: "s4d8f54sd5",
                    output: "geometry",
                },
                needle: {
                    kind: "link",
                    node: "5sdf54ssdf",
                    output: "geometry",
                },
            },
            nodeData: {},
        },
        /* ... */
    },
};
