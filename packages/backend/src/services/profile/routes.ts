import { Request, Response } from 'express';

import redeem from './redeem';
import retrieveUser, {
	PendingConnection,
	User
} from '../../middleware/retrieveUser';

const baseRoute = '/profile';

export default [
	{
		path: baseRoute + '/redeem',
		method: 'get',
		handler: [
			async (req: Request, res: Response) => {
				const auth: any = await retrieveUser(
					req.headers['access-token'],
					req.headers['id-token']
				);

				const user: PendingConnection | User = auth.body;
				if (user.isAuthorized) {
					const { data, status } = await redeem(
						req.query.method,
						user,
						req.query.update
					);

					res.status(status.code).json({
						auth,
						body: data
					});
				} else {
					res.status(401).json({
						user
					});
				}
			}
		]
	}
];
