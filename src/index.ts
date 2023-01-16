import { config } from 'dotenv';
import { initializeApp } from './app';
import { initWithLoadBalancer } from './load-balancer';

const isDev = process.argv.includes('--dev');
const useLoadBalancer = process.argv.includes('--multi');

config();

if (useLoadBalancer) {
	initWithLoadBalancer(initializeApp);
} else {
	initializeApp();
}