import { HttpMethod } from "./http-method"

export type RouteDefinition = {
	requestMethod: HttpMethod;
	path: string;
	methodName: string;
}