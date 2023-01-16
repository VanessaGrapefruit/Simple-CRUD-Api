import cluster, { Worker } from "cluster";
import { createServer, request } from "http";
import { cpus } from "os";

export function initWithLoadBalancer(initializeApp: () => void) {
	if (cluster.isPrimary) {
        const cpusCount = cpus().length;
		const masterPort = process.env.MASTER_PORT ?  parseInt(process.env.MASTER_PORT, 10) : 4000;

        initClusters(masterPort, cpusCount);

        let index = 1;
		const masterServer = createServer(async (req, res) => {
			const url = `http://${req.headers.host?.replace(`${masterPort}`, `${masterPort + index}`)}${req.url}`;

			const childRequest = request(url, { method: req.method }, (result) => {
				res.statusCode = result.statusCode || 500;
				result.on('data', (chunk) => res.write(chunk));
                result.on('error', (err) => res.write(err));
				result.on('end', () => res.end());
			});

			req.on('data', chunk => childRequest.write(chunk)).on('end', () => childRequest.end());

            index = index === cpusCount ? 1 : index + 1;
		});
		masterServer.listen(masterPort, () => {
			console.log(`Master process is listening on port ${masterPort}`);
		});
	} else {
		initializeApp();
	}
}

type WorkerWithPort = { worker: Worker, port: number };

function initClusters(masterPort: number, count: number): WorkerWithPort[] {
    let workers: WorkerWithPort[] = [];

    for (let i  = 1; i <= count; i += 1) {
        const port = masterPort + i;
        const worker = cluster.fork({ PORT: port });
        workers.push({ worker, port: masterPort + 1 });
    }

    cluster.on('exit', (worker, code) => {
        const { port } = workers.find(w => worker.id === w.worker.id) || {};
        console.log(`Worker ${worker.id} on port ${port} died with exit code ${code}`);

        if (port) {
            const newWorker = cluster.fork({ PORT: port });
            workers = [ ...workers.filter(w => w.worker.id !== worker.id), { worker: newWorker, port }];
        }
    });

    return workers;
}