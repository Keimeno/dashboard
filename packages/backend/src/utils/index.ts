import { Router, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { json } from 'body-parser';

dotenv.config();

type Wrapper = (router: Router) => void;

export const applyMiddleware = (
	middlewareWrappers: Wrapper[],
	router: Router
) => {
	for (const wrapper of middlewareWrappers) {
		wrapper(router);
	}
};

type Handler = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<void> | void;

type Route = {
	path: string;
	method: string;
	handler: Handler | Handler[];
};

export const applyRoutes = (routes: Route[], router: Router) => {
	for (const route of routes) {
		const { method, path, handler } = route;
		(router as any)[method](process.env.BASE_PATH + path, handler);
	}
};
