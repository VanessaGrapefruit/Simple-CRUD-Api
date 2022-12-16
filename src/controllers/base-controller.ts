import { IncomingMessage, ServerResponse } from "http";

export class BaseController {
	[key: string]: RouteHandler;
}

export type RouteHandler = (req: IncomingMessage, res: ServerResponse<IncomingMessage>) => Promise<unknown>;

export interface IBaseController {
	[key: string]: RouteHandler;
}