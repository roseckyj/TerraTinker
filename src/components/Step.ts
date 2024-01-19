import { GeneratorData } from "../types/generatorTypes";

export type Step = (
    data: GeneratorData,
    onDataChange: (newData: GeneratorData) => void,
    isSelected: boolean,
    onSelected: () => void
) => {
    menuItem: JSX.Element;
    window: JSX.Element;
};
