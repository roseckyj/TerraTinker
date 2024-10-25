import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import moment from 'moment';
import dns from 'node:dns';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import { forTime } from 'waitasecond';
import { Server } from './Server';
import { Task } from './Task';

if (!process.env.SERVER_URL) {
    dotenv.config();
}

const app: Express = express();
const port = process.env.PORT;

app.use(cors());
app.use(fileUpload());
app.use(
    bodyParser.text({
        type: 'application/json',
    }),
);

(async () => {
    const tasks: Record<string, Task> = {};
    const queue: Task[] = [];

    const [server_hostname, server_port] = (process.env.SERVER_URL || 'localhost:7070').split(':');
    let addresses: string[] = [];
    let tryCount = 0;
    do {
        console.log(`[manager]: Resolving ${server_hostname}, try ${++tryCount}`);
        try {
            addresses = await new Promise<string[]>((resolve, reject) =>
                dns.resolve4(server_hostname, (err, addresses) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(addresses);
                    }
                }),
            );
        } catch (e) {
            console.error(`[manager]: Failed to resolve ${server_hostname}, retrying in 1s`);
            console.error(e);
        }

        await forTime(1000);
    } while (addresses.length === 0);

    console.error(
        `[manager]: Resolved ${server_hostname} to ${addresses.join(', ')}, port ${server_port}, starting manager`,
    );
    const servers: Server[] = addresses.map((url: string) => new Server(`http://${url}:${server_port}`));

    app.get('/', (req: Request, res: Response) => {
        res.redirect('/api');
    });

    app.get('/api', (req: Request, res: Response) => {
        res.send(
            `Manager is connected to servers ${servers.map((server) => server.url).join(', ')} at port ${server_port}`,
        );
    });

    app.get('/api/status', (req: Request, res: Response) => {
        res.json({
            status: 'ok',
            version: '1.0.0',
            servers: servers.map((server, i) => ({
                id: server.id,
                version: server.version,
                online: server.isOnline,
                status: server.currentlyProcessingTask ? 'busy' : 'ready',
            })),
            queue: queue.length,
        });
    });

    app.post('/api/run', (req: Request, res: Response) => {
        const task = new Task(req.body, false);

        tasks[task.id] = task;
        queue.push(task);

        res.json({
            status: 'ok',
            id: task.id,
            weight: task.weight,
        });
    });

    app.post('/api/preview', (req: Request, res: Response) => {
        const task = new Task(req.body, true);

        tasks[task.id] = task;
        queue.push(task);

        res.json({
            status: 'ok',
            id: task.id,
            weight: task.weight,
        });
    });

    app.get('/api/session/:id', (req: Request, res: Response) => {
        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: 'error',
                message: 'Task not found',
            });
            return;
        }

        res.json({
            status: 'ok',
            id: task.id,
            state: task.status,
            server: task.assignedServer ? task.assignedServer.id : null,
            weight: task.weight,
        });
    });

    app.get('/api/session/:id/cancel', (req: Request, res: Response) => {
        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: 'error',
                message: 'Task not found',
            });
            return;
        }

        try {
            task.cancel();
        } catch (e: any) {
            res.status(500).json({
                status: 'error',
                message: e.message,
            });
            return;
        }

        if (queue.includes(task)) {
            queue.splice(queue.indexOf(task), 1);
        }

        res.json({
            status: 'ok',
        });
    });

    app.get('/api/session/:id/zip', async (req: Request, res: Response) => {
        // Just forward the request to the generator
        // The generator will handle the response

        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: 'error',
                message: 'Task not found',
            });
            return;
        }

        if (!task.assignedServer) {
            res.status(404).json({
                status: 'error',
                message: 'The task not yet assigned to a server',
            });
            return;
        }

        if (!task.assignedServer.isOnline) {
            res.status(404).json({
                status: 'error',
                message: 'The assigned server is offline',
            });
            return;
        }

        if (task.status !== 'finished') {
            res.status(404).json({
                status: 'error',
                message: 'The task is not finished',
            });
            return;
        }

        (
            await task.assignedServer.axios.get(`/session/${task.onServerId}/zip`, {
                responseType: 'stream',
            })
        ).data.pipe(res);
    });

    app.get('/api/session/:id/region/:x/:z', async (req: Request, res: Response) => {
        // Just forward the request to the generator
        // The generator will handle the response

        const task = tasks[req.params.id];

        if (!task) {
            res.status(404).json({
                status: 'error',
                message: 'Task not found',
            });
            return;
        }

        if (!task.assignedServer) {
            res.status(404).json({
                status: 'error',
                message: 'The task not yet assigned to a server',
            });
            return;
        }

        if (!task.assignedServer.isOnline) {
            res.status(404).json({
                status: 'error',
                message: 'The assigned server is offline',
            });
            return;
        }

        if (task.status !== 'finished') {
            res.status(404).json({
                status: 'error',
                message: 'The task is not finished',
            });
            return;
        }

        (
            await task.assignedServer.axios.get(`/session/${task.onServerId}/region/${req.params.x}/${req.params.z}`, {
                responseType: 'stream',
            })
        ).data.pipe(res);
    });

    const writeFile = promisify(fs.writeFile);
    const readFile = promisify(fs.readFile);

    const getFilePath = (filename: string) => path.join(process.cwd(), 'uploads', filename);

    const error = (message: string, res: Response) => {
        res.status(400).json({ status: 'error', message });
    };

    app.post('/api/files/upload', async (req: Request, res: Response) => {
        if (!req.files || !req.files.file) {
            error('No file uploaded', res);
            return;
        }

        const uploadedFile = req.files.file as UploadedFile;
        const uuid = uuidv4();
        const extension = path.extname(uploadedFile.name);
        const filename = `${uuid}${extension}`;

        try {
            await writeFile(getFilePath(filename), uploadedFile.data);

            const meta = {
                filename: uploadedFile.name,
                extension,
                size: uploadedFile.size,
                mimetype: uploadedFile.mimetype,
                uuid,
                timestamp: moment().toISOString(),
                additionalFiles: {},
            };

            const metaFilename = `${uuid}.meta`;
            await writeFile(getFilePath(metaFilename), JSON.stringify(meta, null, 4), 'utf-8');

            res.status(200).json({ status: 'ok', data: meta });
        } catch (e) {
            error('Failed to save file', res);
        }
    });

    app.get('/api/files/:id', async (req: Request, res: Response) => {
        const id = req.params.id;
        const metaFilePath = getFilePath(`${id}.meta`);

        if (!fs.existsSync(metaFilePath)) {
            error('File not found', res);
            return;
        }

        try {
            const meta = await readFile(metaFilePath, 'utf-8');
            res.status(200).json({ status: 'ok', data: JSON.parse(meta) });
        } catch (e) {
            error('Failed to read meta file', res);
        }
    });

    app.get('/api/files/:id/upload', async (req: Request, res: Response) => {
        const id = req.params.id;
        const metaFilePath = getFilePath(`${id}.meta`);

        if (!fs.existsSync(metaFilePath)) {
            error('File not found', res);
            return;
        }

        try {
            const meta = JSON.parse(await readFile(metaFilePath, 'utf-8'));

            if (!req.files || !req.files.file) {
                error('No file uploaded', res);
                return;
            }

            const uploadedFile = req.files.file as UploadedFile;
            const extension = path.extname(uploadedFile.name);
            const filename = `${meta.uuid}${extension}`;

            await writeFile(getFilePath(filename), uploadedFile.data);

            if (!meta.additionalFiles) {
                meta.additionalFiles = {};
            }

            if (meta.additionalFiles[extension]) {
                error('File with this extension already uploaded', res);
                return;
            }

            meta.additionalFiles[extension] = filename;
            await writeFile(metaFilePath, JSON.stringify(meta, null, 4), 'utf-8');

            res.status(200).json({ status: 'ok', data: meta });
        } catch (e) {
            error('Failed to save file', res);
        }
    });

    app.listen(port, () => {
        console.log(`[manager]: Server is running at http://localhost:${port}`);
    });

    // Check server status
    setInterval(async () => {
        await Promise.all(
            servers.map((server) => {
                server.checkStatus();
            }),
        );
    }, 1000);

    // Queue tasks
    setInterval(async () => {
        if (queue.length === 0) return;

        servers
            .filter((server) => server.currentlyProcessingTask === null && server.isOnline)
            .forEach((server) => {
                const task = queue.shift();
                if (task) {
                    task.run(server);
                }
            });
    }, 100);
})();
