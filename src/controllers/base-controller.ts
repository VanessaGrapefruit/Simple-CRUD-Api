import { Request, Response } from "../types/request-listener-types";
import { HttpError } from '../types/http-error';

export class BaseController {
	protected response!: Response;

	protected setStatus(statusCode: number): void {
		this.response.statusCode = statusCode;
	}

	protected internalError(error: unknown): HttpError {
		console.error(error);
		this.setStatus(500);
		if (error instanceof Error) {
			return { description: error.message, callStack: error.stack };
		} else {
			return { error };
		}
	}

	protected badRequest(description: string): HttpError {
		this.setStatus(400);
		return { description };
	}

	protected notFound(description: string): HttpError {
		this.setStatus(404);
		return { description };
	}

	protected async getRequestBodyString(request: Request): Promise<string> {
		return new Promise((resolve, reject) => {
			request.on('error', (error) => {
				reject(error);
			});

			const chunks: Uint8Array[] = [];
			let body: string;
			request.on('data', (chunk: Uint8Array) => {
				chunks.push(chunk);
			}).on('end', () => {
				body = Buffer.concat(chunks).toString();
				resolve(body);
			})
		});
	}

	public setResponse(response: Response): void {
		this.response = response;
	}

	public getHandler(methodName: string): RouteHandler {
		return (this as any)[methodName].bind(this);
	}
}

export type RouteHandler = (request: Request, param?: string) => Promise<unknown>;