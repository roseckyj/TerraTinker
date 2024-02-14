import * as React from "react";

interface IErrorBoundaryProps {
    children: React.ReactNode;
    error: (error: any) => React.ReactNode;
}

interface IErrorBoundaryState {
    error: any;
}

export class ErrorBoundary extends React.Component<
    IErrorBoundaryProps,
    IErrorBoundaryState
> {
    state: IErrorBoundaryState = {
        error: null,
    };

    static getDerivedStateFromError(error: any) {
        return { error };
    }

    componentDidCatch(error: any, errorInfo: any) {
        console.error(error, errorInfo);
    }

    render() {
        if (this.state.error) {
            return this.props.error(this.state.error);
        }
        return this.props.children;
    }
}
