import { Request, Response, NextFunction } from 'express';

import authenticateUser from './login';
import retrieveUser from '../../middleware/retrieveUser';

const baseRoute = '/auth';

export default [
	{
		path: baseRoute + '/login',
		method: 'get',
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				const { data, status } = await authenticateUser(
					req.query.user,
					req.query.pass,
					req,
					res,
					next
				);
				res.status(status.code).json({
					...data
				});
			}
		]
	},
	{
		path: baseRoute + '/retrieveUser',
		method: 'get',
		handler: [
			async (req: Request, res: Response, next: NextFunction) => {
				const auth: object = await retrieveUser(
					/**
					 * Not using the X- Prefix for custom headers,
					 * as recommended in RFC6648.
					 */
					req.headers['access-token'],
					req.headers['id-token']
				);
				res.status(200).json({
					...auth
				});
			}
		]
	}
];
