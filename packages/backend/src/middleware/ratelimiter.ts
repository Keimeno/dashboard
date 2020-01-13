import redis from 'redis';
import moment from 'moment';
import { Request, Response, NextFunction } from 'express';

const redisClient = redis.createClient();

export const removeClient = async (req: Request) => {
	redisClient.exists(req.ip, (err: Error | null, reply: number) => {
		if (err) {
			console.log('Redis not working...');
			process.exit(1);
		}
		if (reply === 1) {
			redisClient.del(req.ip);
		}
	});
};

export default async (req: Request, res: Response, next: NextFunction) => {
	return new Promise((resolve?, reject?) => {
		redisClient.exists(req.ip, (err: Error | null, reply: number) => {
			if (err) {
				console.log('Redis not working...');
				process.exit(1);
			}
			if (reply === 1) {
				// user exists
				// check time interval
				redisClient.get(req.ip, (err: Error | null, reply: string) => {
					let data = JSON.parse(reply);
					let currentTime = moment().unix();
					let difference = (currentTime - data.startTime) / 60;
					if (difference >= 5) {
						let body = {
							count: 1,
							startTime: moment().unix()
						};
						redisClient.set(req.ip, JSON.stringify(body));
						resolve({
							success: true
						});
					} else if (difference < 5) {
						if (data.count > 4) {
							resolve({
								success: false
							});
						} else {
							// update the count and allow the request
							data.count++;
							redisClient.set(req.ip, JSON.stringify(data));
							resolve({
								success: true
							});
						}
					}
				});
			} else {
				// add new user
				let body = {
					count: 1,
					startTime: moment().unix()
				};
				redisClient.set(req.ip, JSON.stringify(body));
				resolve({
					success: true
				});
			}
		});
	});
};
