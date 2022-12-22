import { IncomingMessage, ServerResponse } from "http";
import { BaseController } from "../controllers/base-controller";
import { RouteDefinition } from "../types/route-definition";
import { prefixPropertyKey, routePropertyKey } from "./routes-constants";
import { Request, Response } from '../types/request-listener-types';

type Controller = {
	instance: BaseController;
	routes: RouteDefinition[];
}

type Handlers = {
	[key: string]: Controller;
}

export function registerControllers<T extends new () => BaseController>(controllers: T[]) {
	const handlers: Handlers = {};
	controllers.forEach(controller => {
		const instance = new controller();
		const prefix = Reflect.get(controller, prefixPropertyKey) as string;
		const routes = Reflect.get(controller, routePropertyKey) as RouteDefinition[];
		handlers[prefix] = { instance, routes };
	});

	return async (request: Request, response: Response) => {
		const prefix = Object.keys(handlers).find(prefix => request.url?.startsWith(prefix));
		const controller = handlers[prefix || ''];
		let regex = new RegExp('');
		const route = controller?.routes.find(route => {
			regex = new RegExp(`${prefix}${route.path}$`);
			return route.requestMethod === request.method && request.url?.match(regex);
		});
		if (route) {
			const groups = regex?.exec(request.url || '');
			const param = groups?.[1];
			const handler = controller.instance.getHandler(route.methodName);
			controller.instance.setResponse(response);
			return handler && (await handler(request, param));
		} else {
			response.statusCode = 404;
			return { error: 'Route is not specefied' };
		}
	}
}