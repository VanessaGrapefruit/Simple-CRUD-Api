const paramRegex = /\/(:\w+)\/?/;

const mask = (substring: string, param: string) => {
	return substring.replace(param, '([\\w-]+)?');
}

export const replaceRouteParams = (path: string) => {
	return path.replace(paramRegex, mask);
}