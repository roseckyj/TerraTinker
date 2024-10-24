import { v4 as uuidv4 } from 'uuid';
import { Server } from "./Server";

export class Task {
    id: string;

    input: string;
    isPreview: boolean;

    weight: number;

    assignedServer: Server | null = null;
    onServerId: string | null = null;
    status: "queued" | "running" | "finished" | "error" | "canceled" = "queued";

    public constructor(input: string, isPreview: boolean) {
        this.id = uuidv4();

        this.input = input;
        this.isPreview = isPreview;

        const parsed = JSON.parse(input);
        this.weight = parsed.mapSize.width * parsed.mapSize.height * parsed.layers.length;
    }

    public async checkStatus() {
        if (!this.assignedServer) return;
        if (!this.assignedServer.isOnline) return;

        const response = await this.assignedServer.axios.get(`/session/${this.onServerId}`);

        if (response.status === 200) {
            this.status = response.data.state;
            console.log(`Task ${this.id} is ${this.status}`);
        }
    }

    public async run(server: Server) {
        this.assignedServer = server;
        server.currentlyProcessingTask = this;

        const response = await server.axios.post(`/${this.isPreview ? "preview" : "run"}`, this.input);

        if (response.status === 200) {
            this.onServerId = response.data.id;
            this.status = "running";
        }
    }

    public async cancel() {
        if (!this.assignedServer || !this.onServerId || this.status !== "running") return;

        const response = await this.assignedServer.axios.get(`/session/${this.onServerId}/cancel`);

        if (response.status === 200) {
            this.status = "canceled";
        }
    }
}