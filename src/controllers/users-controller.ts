import { BaseController } from "./base-controller";
import { Controller } from '../decorators/controller';
import { Get, Post, Put, Delete } from '../decorators/route';
import { Request } from "../types/request-listener-types";
import { LoggerService } from "../services/logger-service";
import { UsersSchema } from '../services/users-schema';
import { UsersValidator } from '../services/users-validator';
import { User } from "../types/user";


@Controller('/api/users')
export class UsersController extends BaseController {

	@Get('')
	public async getUsers() {
		try {
			this.setStatus(200);

			return UsersSchema.getUsers();
		} catch (error) {
			return this.internalError(error);
		}
	}

	@Get('/:userId')
	public async getUser(request: Request, userId?: string) {
		try {
			if (!userId || !this.isIdValid(userId)) {
				return this.badRequest('userId is null');
			}

			const user = UsersSchema.getUserById(userId);

			if (user) {
				this.setStatus(200);

				return user;
			} else {
				return this.notFound(`User with id ${userId} is not found`);
			}
		} catch (error) {
			return this.internalError(error);
		}
	}

	@Post('')
	public async createUser(request: Request) {
		try {
			const body = await this.getRequestBody(request);
			const user = JSON.parse(body);

			if (UsersValidator.validate(user)) {
				const createdUser = UsersSchema.createUser(user);

				this.setStatus(201);
				
				return createdUser;
			} else {
				return this.badRequest('Bad request');
			}
		} catch (error) {
			return this.internalError(error);
		}
	}
}