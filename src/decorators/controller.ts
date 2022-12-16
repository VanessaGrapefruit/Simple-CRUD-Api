import { prefixPropertyKey, routePropertyKey } from "../constants/routes-constants";

export const Controller = (prefix: string = ''): ClassDecorator => {
	return (target) => {
		Reflect.set(target, prefixPropertyKey, prefix);

		if (!Reflect.has(target, routePropertyKey)) {
			Reflect.set(target, routePropertyKey, []);
		}
	}
}