import { createServer } from "http";
import { UsersController } from './controllers/users-controller';
import { registerControllers } from './constants/register-controllers';
import { LoggerService } from './services/logger-service';
import { UsersSchema } from "./services/users-schema";

export async function initializeApp() {
	const port = process.env.PORT || 4000;

	await UsersSchema.initAsync();

	const handler = registerControllers([
		UsersController
	]);
	const server = createServer(async (req, res) => {
		const result = await handler(req, res);
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(result));

		LoggerService.api(req.method, req.url, res.statusCode);
	});

	server.listen(port, () => {
		console.log(`Server is listening on port ${port}`);
	});
}

