import { BaseController } from "./base-controller";
import { Controller } from '../decorators/controller';
import { Get, Post, Put, Delete } from '../decorators/route';
import { Request } from "../types/request-listener-types";
import { UsersSchema } from '../services/users-schema';
import { UsersValidator } from '../services/users-validator';
import { User } from "../types/user";
import { HttpError } from "../types/http-error";


@Controller('/api/users')
export class UsersController extends BaseController {

	@Get('')
	public async getUsers(): Promise<User[] | HttpError> {
		try {
			this.setStatus(200);

			return UsersSchema.getUsers();
		} catch (error) {
			return this.internalError(error);
		}
	}

	@Get('/:userId')
	public async getUser(request: Request, userId?: string): Promise<User | HttpError> {
		try {
			if (!UsersValidator.isValidId(userId)) {
				return this.badRequest('userId parameter is not valid');
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
	public async createUser(request: Request): Promise<User | HttpError> {
		try {
			const body = await this.getRequestBodyString(request);
			const user = JSON.parse(body);

			if (UsersValidator.isValidUser(user)) {
				const createdUser = UsersSchema.createUser(user);

				this.setStatus(201);
				
				return createdUser;
			} else {
				return this.badRequest('Request body is not assignable to UserDto');
			}
		} catch (error) {
			return this.internalError(error);
		}
	}

	@Put('/:userId')
	public async updateUser(request: Request, userId?: string): Promise<User | HttpError> {
		try {
			const body = await this.getRequestBodyString(request);
			const user = JSON.parse(body);

			if (!UsersValidator.isValidId(userId)) {
				return this.badRequest('userId parameter is not valid');
			} else if (!UsersValidator.isValidUser(user)) {
				return this.badRequest('Request body is not assignable to UserDto');
			}

			const updatedUser = UsersSchema.updateUser(user, userId);
			if (updatedUser) {
				this.setStatus(200);
				return updatedUser;
			} else {
				return this.notFound(`User with id ${userId} is not found`);
			}
		} catch (error) {
			return this.internalError(error);
		}
	}

	@Delete('/:userId')
	public async deleteUser(request: Request, userId?: string): Promise<void | HttpError> {
		try {
			if (!UsersValidator.isValidId(userId)) {
				return this.badRequest('userId parameter is not valid');
			}

			const isUserDeleted = UsersSchema.deleteUser(userId);
			if (isUserDeleted) {
				this.setStatus(204);
				return;
			} else {
				return this.notFound(`User with id ${userId} is not found`);
			}
		} catch (error) {
			return this.internalError(error);
		}
	}
}