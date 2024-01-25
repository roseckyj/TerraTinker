import { action, computed, makeObservable, observable } from "mobx";
import { ProviderProps, createContext, useContext } from "react";
import { resolvePath } from "../../utils/resolvePath";
import { Help } from "./Help";

class HelpContext {
    public path: string | null = null;
    public history: string[] = [];

    public onOpen(path: string) {
        this.path = resolvePath(path, this.path, true);
        this.history.push(this.path);
        console.log(this.path);
    }

    public onClose() {
        this.path = null;
    }

    public onBack() {
        this.history.pop();
        this.path = this.history[this.history.length - 1] ?? null;
        console.log(this.path);
    }

    public onReopen() {
        if (this.history.length === 0) {
            this.history.push("0");
        }
        this.path = this.history[this.history.length - 1]!;
        console.log(this.path);
    }

    public get isOpen() {
        return this.path !== null;
    }

    public get currentPath() {
        const parsed = this.path?.split("/") ?? [];
        // Trim empty strings
        return parsed.filter((x) => x.length > 0);
    }

    constructor() {
        makeObservable(this, {
            path: observable,
            history: observable,
            isOpen: computed,
            currentPath: computed,
            onOpen: action,
            onClose: action,
            onBack: action,
            onReopen: action,
        });
    }
}

const helpContext = createContext<HelpContext>(new HelpContext());

export function HelpProvider({
    children,
    ...props
}: Omit<ProviderProps<HelpContext>, "value">) {
    const store = new HelpContext();

    return (
        <helpContext.Provider {...props} value={store}>
            {children}
            <Help />
        </helpContext.Provider>
    );
}

export function useOpenHelp(): typeof HelpContext.prototype.onOpen {
    const help = useContext(helpContext);
    return (path) => help.onOpen(path);
}

export function useHelp(): HelpContext {
    return useContext(helpContext);
}
