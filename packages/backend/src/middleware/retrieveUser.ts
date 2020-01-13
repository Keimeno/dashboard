import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import { query as xfQuery, escape } from './XenforoDB';
import { query as nvQuery } from './dashboardDB';
import { nameResolve, permission } from './dashboardAPI';

dotenv.config();

const publicKey = process.env.PUBLIC_KEY as string;
const privateKey = process.env.PRIVATE_KEY as string;
const issuer = process.env.ISSUER as string;

export type PendingConnection = {
	isAuthorized: boolean;
};

export type User = PendingConnection & {
	id: number;
	isStaff: boolean;
	registerDate: number;
	hasMinecraftLink: boolean;
	minecraftName: string;
	minecraftUUID: string;
	globalGroupName: string;
	globalGroupPriority: number;
};

export const genIdToken = (data: Object): String => {
	return jwt.sign(
		{
			...data
		},
		privateKey,
		{
			algorithm: 'RS256',
			expiresIn: '30m',
			issuer
		}
	);
};

export default async (accessToken: any, idToken?: any): Promise<object> => {
	let data: PendingConnection | User | any;

	// REMOVE LATER
	data = {
		id: 23003,
		isAuthorized: true,
		isStaff: true,
		registerDate: 153438324324,
		minecraftUUID: '6ee9150c-b99c-4d7f-9980-eb05c0c603e1',
		minecraftName: 'Keimeno',
		globalGroupName: 'Developer',
		globalGroupPriority: '3',
		hasMinecraftLink: true
	};

	const newIdToken: String = genIdToken(data);

	return {
		body: data,
		id_token: newIdToken,
		access_token: accessToken
	};
	// REMOVE LATER

	// Checks if the JWT is valid
	try {
		data = jwt.verify(accessToken, publicKey, { algorithms: ['RS256'] });
	} catch (err) {
		data = err;
	}

	if (data['message'] !== undefined) {
		return { isAuthorized: false };
	}

	if (idToken) {
		let cachedData: any;

		try {
			cachedData = jwt.verify(idToken, publicKey, {
				algorithms: ['RS256']
			});
		} catch (err) {
			cachedData = err;
		} finally {
			if (cachedData['message'] === undefined) {
				return {
					body: cachedData,
					id_token: idToken,
					access_token: accessToken
				};
			}
		}
	}

	const userId: string = data.id;

	// Builds user data query
	const userDataQuery: string =
		'SELECT is_staff, register_date FROM xf_user WHERE user_id=' +
		escape(userId) +
		';';

	// retrieves the user data
	const userData: any = (await xfQuery(userDataQuery))[0];

	// Builds user profile query
	const forumUserQuery: string =
		'SELECT uuid FROM forum_users WHERE id=' + escape(userId) + ';';

	// retrieves the minecraft name
	const minecraftUUIDRow: any = (await nvQuery(forumUserQuery))[0];

	const minecraftUUID: string | undefined =
		minecraftUUIDRow === undefined ? undefined : minecraftUUIDRow['uuid'];

	const minecraftName: string | undefined =
		minecraftUUID === undefined
			? undefined
			: await nameResolve('minecraftUUID', 'name');

	// Gets the Global Group of the player
	const globalGroup: any =
		minecraftUUID === undefined
			? undefined
			: await permission('minecraftUUID');
	const globalGroupName: string | undefined =
		globalGroup === undefined ? undefined : globalGroup['name'];
	const globalGroupPriority: number | undefined =
		globalGroup === undefined ? undefined : globalGroup['priority'];

	// Sets to true if player has his minecraft account linked
	const hasMinecraftLink: boolean = minecraftUUID !== undefined;

	// Create a new id_token
	data = {
		id: parseInt(userId),
		isAuthorized: true,
		isStaff: userData.is_staff === 1 ? true : false,
		registerDate: userData.register_date,
		minecraftUUID,
		minecraftName,
		globalGroupName,
		globalGroupPriority,
		hasMinecraftLink
	};

	// REMOVE LATER
	// const newIdToken: String = genIdToken(data);
	// REMOVE LATER

	return {
		body: data,
		id_token: newIdToken,
		access_token: accessToken
	};
};
