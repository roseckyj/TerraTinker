import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Task } from "./Task";

export class Server {
    id: string;

    url: string;
    version: string = "";

    isOnline: boolean = false;
    currentlyProcessingTask: Task | null = null;

    private axiosClient;

    public constructor(url: string) {
        this.id = uuidv4();

        this.url = url;
        this.axiosClient = axios.create({
            baseURL: this.url + "/api",
            timeout: 500,
        });

        this.checkStatus();
    }

    public async checkStatus() {
        try {
            const response = await this.axiosClient.get("/status");
            if (response.status === 200) {
                this.isOnline = true;
                this.version = response.data.version;

                if (response.data.queued === 0 && this.currentlyProcessingTask) {
                    await this.currentlyProcessingTask.checkStatus();
                    if (this.currentlyProcessingTask.status !== "running") {
                        this.currentlyProcessingTask = null;
                    }
                }
            } else {
                this.isOnline = false;
            }
        } catch (e) {
            this.isOnline = false;
        }
    }

    public get axios() {
        if (!this.isOnline) {
            throw new Error("Server is offline");
        }
        return this.axiosClient;
    }
}