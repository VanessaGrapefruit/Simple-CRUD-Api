import cluster from 'cluster';
import { config } from 'dotenv';
import { cpus } from 'os';
import { initializeApp } from './app';

config();

initializeApp();

function initWithLoadBalancer() {
	const cpusCount = cpus().length;

	if (cluster.isPrimary) {
		const masterPort = process.env.MASTER_PORT ?  parseInt(process.env.MASTER_PORT, 10) : 4000;
		console.log(`Master ${process.pid} is running`);

		for (let i  = 0; i < cpusCount; i += 1) {
			cluster.fork({ PORT: masterPort + i });
		}

		cluster.on('exit', (worker, code, signal) => {
			console.log(`Worker ${worker.process.pid} died with exit code ${code}`);
			cluster.fork();
		});
	} else {
		initializeApp();
	}
}