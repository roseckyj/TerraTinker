import axios, { AxiosProgressEvent, AxiosResponse } from "axios";

export class Api {
    private apiURL: string = "";

    constructor() {
        this.findApiEndpoint();
    }

    private async findApiEndpoint() {
        let url = new URL(window.location.href);

        // https://current-host/api
        url = new URL(window.location.href);
        url.pathname = "/api";

        if (await this.testApiEndpoint(url)) {
            this.apiURL = url.toString();
            return;
        }

        // https://current-host:8080/api
        url = new URL(window.location.href);
        url.port = "8080";
        url.pathname = "/api";

        if (await this.testApiEndpoint(url)) {
            this.apiURL = url.toString();
            return;
        }

        // Fallback to the default
        url = new URL(window.location.href);
        url.pathname = "/api";
        this.apiURL = url.toString();
    }

    private async testApiEndpoint(url: URL) {
        try {
            const response = await axios.get(url.toString() + "/status", {
                validateStatus: () => true,
            });

            return response.status === 200;
        } catch (e) {
            return false;
        }
    }

    public async get(path: string) {
        return await this.request("GET", path);
    }

    public async post(path: string, body: any) {
        return await this.request("POST", path, body);
    }

    public async put(path: string, body: any) {
        return await this.request("PUT", path, body);
    }

    public async delete(path: string) {
        return await this.request("DELETE", path);
    }

    public async uploadFile(
        file: File,
        path: string,
        onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
    ) {
        const formData = new FormData();
        formData.append("file", file);
        const response = await axios.post(this.apiURL + path, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            validateStatus: () => true,
            onUploadProgress,
        });
        return response;
    }

    public getUrl(path: string) {
        return this.apiURL + path;
    }

    private async request(
        method: string,
        path: string,
        body?: any
    ): Promise<AxiosResponse<any, any> | null> {
        try {
            return await axios.request({
                method: method,
                url: this.apiURL + path,
                data: body,
                validateStatus: () => true,
            });
        } catch (e) {
            return null;
        }
    }
}
