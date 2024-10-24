import bodyParser from 'body-parser';
import cors from "cors";
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import dns from "node:dns";
import { forTime } from 'waitasecond';
import { Server } from './Server';
import { Task } from './Task';

if (!process.env.SERVER_URL) {
    dotenv.config();
}

const app: Express = express();
const port = process.env.PORT;

(async () => {

    const tasks: Record<string, Task> = {};
    const queue: Task[] = [];

    const [server_hostname, server_port] = (process.env.SERVER_URL || "localhost:7070").split(":");
    let addresses: string[] = [];
    let tryCount = 0;
    do {
        console.log(`[manager]: Resolving ${server_hostname}, try ${++tryCount}`);
        try {
            addresses = await new Promise<string[]>((resolve, reject) => dns.resolve4(server_hostname, (err, addresses) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(addresses);
                }
            }));

        } catch (e) {
            console.error(`[manager]: Failed to resolve ${server_hostname}, retrying in 1s`);
            console.error(e);
        }

        await forTime(1000);
    } while (addresses.length === 0);

    console.error(`[manager]: Resolved ${server_hostname} to ${addresses.join(", ")}, port ${server_port}, starting manager`);
    const servers: Server[] = addresses.map((url: string) => new Server(`http://${url}:${server_port}`));

    app.use(cors());
    app.use(bodyParser.text({
        type: "*/*"
    }))

    app.get('/', (req: Request, res: Response) => {
        res.redirect("/api");
    });

    app.get('/api', (req: Request, res: Response) => {
        res.send(`Manager is connected to servers ${servers.map(server => server.url).join(", ")} at port ${server_port}`);
    });

    app.get("/api/status", (req: Request, res: Response) => {
        res.json({
            status: "ok",
            version: "1.0.0",
            servers: servers.map((server, i) => ({
                id: server.id,
                version: server.version,
                online: server.isOnline,
                status: server.currentlyProcessingTask ? "busy" : "ready"
            })),
            queue: queue.length
        });
    });

    app.post("/api/run", (req: Request, res: Response) => {
        const task = new Task(req.body, false);

        tasks[task.id] = task;
        queue.push(task);

        res.json({
            status: "ok",
            id: task.id,
            weight: task.weight,
        });
    });

    app.post("/api/preview", (req: Request, res: Response) => {
        const task = new Task(req.body, true);

        tasks[task.id] = task;
        queue.push(task);

        res.json({
            status: "ok",
            id: task.id,
            weight: task.weight,
        });    
    });

    app.get("/api/session/:id", (req: Request, res: Response) => {
        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: "error",
                message: "Task not found",
            });
            return;
        }

        res.json({
            status: "ok",
            id: task.id,
            state: task.status,
            server: task.assignedServer ? task.assignedServer.id : null,
            weight: task.weight,
        });    
    });

    app.get("/api/session/:id/cancel", (req: Request, res: Response) => {
        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: "error",
                message: "Task not found",
            });
            return;
        }

        try {
            task.cancel();
        } catch (e: any) {
            res.status(500).json({
                status: "error",
                message: e.message,
            });
            return;
        }

        if (queue.includes(task)) {
            queue.splice(queue.indexOf(task), 1);
        }

        res.json({
            status: "ok",
        });
    });

    app.get("/api/session/:id/zip", async (req: Request, res: Response) => {
        // Just forward the request to the generator
        // The generator will handle the response

        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: "error",
                message: "Task not found",
            });
            return;
        }

        if (!task.assignedServer) {
            res.status(404).json({
                status: "error",
                message: "The task not yet assigned to a server",
            });
            return;
        }

        if (!task.assignedServer.isOnline) {
            res.status(404).json({
                status: "error",
                message: "The assigned server is offline",
            });
            return;
        }

        if (task.status !== "finished") {
            res.status(404).json({
                status: "error",
                message: "The task is not finished",
            });
            return;
        }

        (await task.assignedServer.axios.get(`/session/${task.onServerId}/zip`, {
            responseType: "stream",
        })).data.pipe(res);
    });

    app.get("/api/session/:id/region/:x/:z", async (req: Request, res: Response) => {
        // Just forward the request to the generator
        // The generator will handle the response

        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: "error",
                message: "Task not found",
            });
            return;
        }

        if (!task.assignedServer) {
            res.status(404).json({
                status: "error",
                message: "The task not yet assigned to a server",
            });
            return;
        }

        if (!task.assignedServer.isOnline) {
            res.status(404).json({
                status: "error",
                message: "The assigned server is offline",
            });
            return;
        }

        if (task.status !== "finished") {
            res.status(404).json({
                status: "error",
                message: "The task is not finished",
            });
            return;
        }

        (await task.assignedServer.axios.get(`/session/${task.onServerId}/region/${req.params.x}/${req.params.z}`, {
            responseType: "stream",
        })).data.pipe(res);    
    });

    app.post("/api/files/upload", (req: Request, res: Response) => {
        //TBD
    });

    app.get("/api/files/:id", (req: Request, res: Response) => {
        //TBD
        
    });

    app.get("/api/files/:id/upload", (req: Request, res: Response) => {
        //TBD
        
    });

    app.listen(port, () => {
        console.log(`[manager]: Server is running at http://localhost:${port}`);
    });


    // Check server status
    setInterval(async () => {
        await Promise.all(servers.map(server => {
            server.checkStatus();
        }));        
    }, 1000);

    // Queue tasks
    setInterval(async () => {
        if (queue.length === 0) return;

        servers.filter(server => server.currentlyProcessingTask === null && server.isOnline).forEach(server => {
            const task = queue.shift();
            if (task) {
                task.run(server);
            }
        });
        
    }, 100);

})();