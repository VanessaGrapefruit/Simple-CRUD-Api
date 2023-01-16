import { createServer } from "http";
import { UsersController } from './controllers/users-controller';
import { registerControllers } from './constants/register-controllers';

export async function initializeApp() {
	const port = process.env.PORT || 4000;

	const handler = registerControllers([
		UsersController
	]);
	const server = createServer(async (req, res) => {
		const result = await handler(req, res);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));

		console.log(`[${req.method}] - ${req.url} (port: ${port}) responded with status code: ${res.statusCode}`);
	});

	server.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
	});
}

