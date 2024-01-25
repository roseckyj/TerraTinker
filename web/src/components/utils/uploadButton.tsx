import { Button, ButtonProps } from "@chakra-ui/react";
import { useRef } from "react";

export type IUploadButtonProps = {
    onFile: (file: File) => void;
} & ButtonProps;

export function UploadButton({ onFile, ...rest }: IUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                style={{ display: "none" }}
                onChange={(e) => {
                    if (e.target.files) {
                        onFile(e.target.files[0]);
                    }
                }}
            />
            <Button
                {...rest}
                onClick={() => {
                    inputRef.current?.click();
                }}
            />
        </>
    );
}
