export async function openFile(accept: string) {
    return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = accept;

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files![0];
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    resolve(e.target!.result);
                } catch (e) {
                    reject(e);
                }

                input.remove();
            };
            reader.readAsText(file);
        };

        input.click();
    });
}
