import { config } from 'dotenv';
import { initializeApp } from './app';
import { UsersSchema } from './services/users-schema';
import { initWithLoadBalancer } from './load-balancer';

const isDev = process.argv.includes('--dev');
const useLoadBalancer = process.argv.includes('--multi');

config();

if (isDev) {
	UsersSchema.initAsync();
}

if (useLoadBalancer) {
	initWithLoadBalancer(initializeApp);
} else {
	initializeApp();
}