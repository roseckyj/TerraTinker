import usePromise from "react-use-promise";

interface IAwaitProps<T> {
    for: Promise<T>;
    loading?: JSX.Element;
    error?: (error: any) => JSX.Element;
    children:
        | ((data: T) => JSX.Element | JSX.Element[])
        | JSX.Element
        | JSX.Element[];
}

export function Await<T>(props: IAwaitProps<T>): JSX.Element {
    const [data, error, state] = usePromise(props.for, [props.for]);

    switch (state) {
        case "pending":
            return props.loading || <></>;
        case "resolved":
            if (typeof props.children === "function") {
                return (
                    <>{(props.children as (data: T) => JSX.Element)(data)}</>
                );
            }
            return <>{props.children}</>;
        case "rejected":
            console.warn(error);
            if (props.error) return props.error(error);
            return <></>;
    }
}
