import axios from 'axios';

const axiosInstance = axios.create({
	baseURL: 'http://api.dashboard.net:9797'
});

export const remVal = async (
	method: string,
	uuid: string,
	key: any,
	value?: string
): Promise<any> => {
	return new Promise((resolve?: any) => {
		let keysQuery: string = '';
		if (method === 'getBulk') {
			key.forEach((cur: string): void => {
				keysQuery += `dailyreward:${cur},`;
			});
		}

		const queryKey = method === 'getBulk' ? 'keys' : 'key';
		const queryBody =
			method === 'getBulk' ? keysQuery : 'dailyreward:' + key;
		const queryExtra = method === 'set' ? '&value=' + value : '';

		if (method === 'set') {
			axiosInstance
				.post(
					`/remVal/${method}?uuid=${uuid}&${queryKey}=${queryBody}${queryExtra}`
				)
				.then(res => resolve(res.data));
		} else {
			axiosInstance
				.get(
					`/remVal/${method}?uuid=${uuid}&${queryKey}=${queryBody}${queryExtra}`
				)
				.then(res => resolve(res.data));
		}
	});
};

export const permission = async (uuid: string): Promise<any> => {
	return new Promise((resolve?: any) => {
		axiosInstance
			.get(`/permission/get?uuid=${uuid}`)
			.then(res => resolve(res.data['primaryGroups']['global']));
	});
};

export const economy = async (
	method: string,
	economyName: string,
	uuid: string,
	amount: string | number
): Promise<void> => {
	return new Promise((resolve?: any) => {
		axiosInstance.post(
			`/economy/${method}?economyName=${economyName}&uuid=${uuid}&amount=${amount}`
		);
	});
};

export const nameResolve = async (
	identifier: string,
	key: string
): Promise<any> => {
	return new Promise((resolve?: any) => {
		axiosInstance
			.get(`/nameResolve/get?identifier=${identifier}`)
			.then(res => resolve(res.data[key]));
	});
};

export default axiosInstance;
