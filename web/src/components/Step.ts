import { GeneratorData } from "../types/generatorTypes";

export type Step = (
    data: GeneratorData,
    onDataChange: (newData: GeneratorData) => void,
    isSelected: boolean,
    onSelected: () => void
) => {
    menuItem: (key: number) => JSX.Element;
    window: (key: number) => JSX.Element;
};
