import { BaseController } from "./base-controller";
import { Controller } from '../decorators/controller';
import { Get, Post, Put, Delete } from '../decorators/route';

@Controller('/api/users')
export class UsersController extends BaseController {

	@Get('')
	async getUsers() {
		return [1, 2, 3];
	}

	@Get('/:userId')
	async getUser() {

	}
}