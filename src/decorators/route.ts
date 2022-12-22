import { routePropertyKey } from "../constants/routes-constants";
import { HttpMethod } from "../types/http-method";
import { RouteDefinition } from '../types/route-definition';
import { replaceRouteParams } from '../constants/replace-route-params';

export const Route = (path: string, requestMethod: HttpMethod): MethodDecorator => {
	return (target, propertyKey) => {
		const routes = (Reflect.get(target.constructor, routePropertyKey) || []) as RouteDefinition[];

		routes.push({
			requestMethod,
			path: replaceRouteParams(path),
			methodName: propertyKey as string
		});

		Reflect.set(target.constructor, routePropertyKey, routes);
	}
}

export const Get = (path: string) => Route(path, 'GET');
export const Post = (path: string) => Route(path, 'POST');
export const Put = (path: string) => Route(path, 'PUT');
export const Delete = (path: string) => Route(path, 'DELETE');