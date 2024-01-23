import axios from "axios";

export class Api {
    private apiURL: string = "";

    constructor() {
        // Read from current url and change port to 7070
        // Eg. http://localhost:3000/McVizFrontend -> http://localhost:7070/api

        const url = new URL(window.location.href);
        url.port = "7070";
        url.pathname = "/api";
        const path = url.toString();

        console.log("API URL:", path);

        this.apiURL = path;
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

    public getUrl(path: string) {
        return this.apiURL + path;
    }

    private async request(method: string, path: string, body?: any) {
        const response = await axios.request({
            method: method,
            url: this.apiURL + path,
            data: body,
            validateStatus: () => true,
        });
        return response;
    }
}
