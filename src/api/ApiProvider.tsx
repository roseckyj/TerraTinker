import { ProviderProps, createContext, useContext } from "react";
import { Api } from "./Api";

const apiContext = createContext<Api>(new Api());

export function ApiProvider({
    api,
    ...rest
}: { api: Api } & Omit<ProviderProps<Api>, "value">) {
    return <apiContext.Provider {...rest} value={api} />;
}
export function useApi() {
    return useContext(apiContext);
}
