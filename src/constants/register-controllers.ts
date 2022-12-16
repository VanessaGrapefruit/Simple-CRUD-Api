import { IncomingMessage, ServerResponse } from "http";
import { BaseController } from "../controllers/base-controller";
import { RouteDefinition } from "../types/route-definition";
import { prefixPropertyKey, routePropertyKey } from "./routes-constants";

type Controller = {
	instance: BaseController;
	routes: RouteDefinition[];
}

type Handlers = {
	[key: string]: Controller;
}

export function registerControllers(controllers: (new () => BaseController)[]) {
	const handlers: Handlers = {};
	controllers.forEach(controller => {
		const instance = new controller();
		const prefix = Reflect.get(controller, prefixPropertyKey);
		const routes = Reflect.get(controller, routePropertyKey) as RouteDefinition[];
		handlers[prefix] = { instance, routes };
	});

	return async (request: IncomingMessage, response: ServerResponse<IncomingMessage>) => {
		console.log(request.url);
		const prefix = Object.keys(handlers).find(prefix => request.url?.startsWith(prefix));
		const controller = handlers[prefix || ''];
		const route = controller?.routes.find(route => {
			const regex = new RegExp(`${prefix}${route.path}`);
			console.log(regex);
			return route.requestMethod === request.method && request.url?.match(regex);
		});
		if (route) {
			const handler = controller?.instance[route.methodName];
			return handler && (await handler(request, response));
		} else {
			response.statusCode = 404;
			return { error: 'Url is not defined' };
		}
	}
}