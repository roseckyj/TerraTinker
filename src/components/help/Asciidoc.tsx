import Processor from "@asciidoctor/core";
import { useMemo } from "react";

export interface IAsciidocProps {
    children: string;
}

export function Asciidoc(props: IAsciidocProps) {
    const { children } = props;

    const ad = useMemo(() => Processor(), []);
    const compiled = useMemo(() => ad.convert(children), [ad, children]);

    return <div dangerouslySetInnerHTML={{ __html: compiled }} />;
}
