import { query, escape } from '../../middleware/XenforoDB';

import bcrypt from 'bcrypt';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ratelimiter, { removeClient } from '../../middleware/ratelimiter';
import phpunserialize from 'phpunserialize';

import { Response, Request, NextFunction } from 'express';
import retrieveUser, {
	genIdToken,
	User,
	PendingConnection
} from '../../middleware/retrieveUser';

dotenv.config();

const privateKey = process.env.PRIVATE_KEY as string;

export default async (
	user: string,
	password: string,
	request: Request,
	response: Response,
	next: NextFunction
): Promise<any> => {
	// Check if user is username or email
	let check = 'email';

	// REMOVE LATER
	return new Promise(resolve => {
		resolve({
			data: {
				message: 'correctPassword',
				access_token:
					'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDMsImlhdCI6MTU3MzI5NzI3Nn0.CQ1g0Wd3AQsbwD7IAgZqI1FfojnCi71V2BjnGxnlIFjhLeG0cCAT8sEJidY6fiWAXTVOhMx_Mw43Nrqql9h2-w',
				id_token: genIdToken(
					retrieveUser(
						'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDMsImlhdCI6MTU3MzI5NzI3Nn0.CQ1g0Wd3AQsbwD7IAgZqI1FfojnCi71V2BjnGxnlIFjhLeG0cCAT8sEJidY6fiWAXTVOhMx_Mw43Nrqql9h2-w'
					)['body']
				),
				body: retrieveUser(
					'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjMwMDMsImlhdCI6MTU3MzI5NzI3Nn0.CQ1g0Wd3AQsbwD7IAgZqI1FfojnCi71V2BjnGxnlIFjhLeG0cCAT8sEJidY6fiWAXTVOhMx_Mw43Nrqql9h2-w'
				)['body']
			},
			status: {
				code: 200
			}
		});
	});
	// REMOVE LATER

	if (!validator.isEmail(user)) {
		check = 'username';
	}

	// Builds the query
	const userIdQuery =
		'SELECT user_id FROM `xf_user` WHERE `' +
		check +
		'`=' +
		escape(user) +
		';';

	// Gets the user_id
	const userIdRow: any = (await query(userIdQuery))[0];
	const userId: any =
		userIdRow !== undefined ? userIdRow['user_id'] : undefined;

	if (userId === undefined) {
		return {
			data: {
				message: 'wrongUserOrEmail'
			},
			status: {
				code: 401
			}
		};
	}

	const rate: any = await ratelimiter(request, response, next);
	if (rate instanceof Object) {
		if (!rate['success']) {
			return {
				data: {
					message: 'connectionThrottled'
				},
				status: {
					code: 429
				}
			};
		}
	}

	// Builds the password query
	const passQuery =
		'SELECT data FROM `xf_user_authenticate` WHERE `user_id`=' +
		escape(userId) +
		';';

	// Gets the hash from the database
	const hash = phpunserialize((await query(passQuery))[0]['data'].toString())[
		'hash'
	];

	// Returns the reponse object, with error/success messages
	return await new Promise(resolve => {
		bcrypt.compare(password, hash, async (err, same) => {
			if (err) {
				resolve({
					data: {
						message: 'serviceOffline'
					},
					status: {
						code: 500
					}
				});
			} else if (same) {
				const access_token = jwt.sign(
					{
						id: userId as number
					},
					privateKey,
					{ algorithm: 'RS256' }
				);

				// Need to use PendingConnection type as well,
				// as user could not have a minecraft link at this time.
				const userInfo: PendingConnection | User = (
					await retrieveUser(access_token)
				)['body'];

				const id_token = genIdToken(userInfo);

				removeClient(request);

				resolve({
					data: {
						message: 'correctPassword',
						access_token,
						id_token,
						body: userInfo
					},
					status: {
						code: 200
					}
				});
			} else {
				resolve({
					data: { message: 'wrongPassword' },
					status: {
						code: 401
					}
				});
			}
		});
	});
};
