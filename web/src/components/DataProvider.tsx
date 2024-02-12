import {
    createContext,
    useCallback,
    useContext,
    useReducer,
    useState,
} from "react";
import { getDefaultGeneratorData } from "../data/getDefaultGeneratorData";
import { GeneratorData } from "../types/generatorTypes";

interface AppData {
    data: GeneratorData;
    setData: (newData: GeneratorData) => void;
}

const dataContext = createContext<AppData>({
    data: getDefaultGeneratorData(),
    setData: () => {},
});
const localStorageKey = "generatorData";

export function AppDataProvider({ children }: { children: JSX.Element }) {
    const [, forceUpdate] = useReducer((x) => x + 1, 0);
    const [data, setData] = useState(() => {
        const stored = localStorage.getItem(localStorageKey);
        let data: GeneratorData;
        const def = getDefaultGeneratorData();
        if (!stored) {
            data = def;
            localStorage.setItem(localStorageKey, JSON.stringify(data));
        } else {
            data = { ...def, ...JSON.parse(stored) };
        }
        return data;
    });

    const setDataAndSave = useCallback(
        (newData: GeneratorData) => {
            setData(newData);
            forceUpdate();
            localStorage.setItem(localStorageKey, JSON.stringify(newData));
        },
        [forceUpdate, setData]
    );

    return (
        <dataContext.Provider
            value={{
                data,
                setData: setDataAndSave,
            }}
            children={children}
        />
    );
}
export function useAppData() {
    return useContext(dataContext);
}
