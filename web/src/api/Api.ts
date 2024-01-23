import axios from "axios";

export class Api {
    private apiURL: string = "";

    constructor() {
        this.findApiEndpoint();
    }

    private async findApiEndpoint() {
        let url = new URL(window.location.href);

        // https://current-host/api
        url = new URL(window.location.href);
        url.port = "80";
        url.pathname = "/api";

        if (await this.testApiEndpoint(url)) {
            this.apiURL = url.toString();
            return;
        }

        // https://current-host:7070/api
        url = new URL(window.location.href);
        url.port = "7070";
        url.pathname = "/api";

        if (await this.testApiEndpoint(url)) {
            this.apiURL = url.toString();
            return;
        }
    }

    private async testApiEndpoint(url: URL) {
        const response = await axios.get(url.toString() + "/status");
        return response.status === 200;
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
