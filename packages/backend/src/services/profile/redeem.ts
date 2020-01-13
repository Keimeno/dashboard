import { remVal, economy } from '../../middleware/dashboardAPI';
import moment, { Moment } from 'moment';
import { User, PendingConnection } from '../../middleware/retrieveUser';

// Constants
const apiUri: string = '/profile/redeem';
const multiplier: number = 0.1;
const maxStreak: number = 7;
const playerRanks: object = {
	PLAYER: 26,
	VIP: 25,
	PRIME: 23
};
const rankCookies: object = {
	PLAYER: 150,
	VIP: 250,
	PRIME: 500
};

export default async (
	method: string,
	auth: PendingConnection | User,
	update?: string
): Promise<any> => {
	if (method == 'getAll') {
		// REMOVE LATER
		return new Promise(resolve => {
			resolve({
				data: {
					streak: 5,
					apiUri,
					table: [
						{
							name: 'PLAYER',
							redeem: '150 COINS',
							isRedeemed: false,
							isDisabled: false
						},
						{
							name: 'VIP',
							redeem: '350 COINS',
							isRedeemed: true,
							isDisabled: false
						},
						{
							name: 'PRIME',
							redeem: '500 COINS',
							isRedeemed: false,
							isDisabled: true
						}
					]
				},
				status: { code: 200 }
			});
		});
		// REMOVE LATER

		// Gets all the values for the streak, player, vip and prime
		const unfilteredBulkData: any = await remVal(
			'getBulk',
			auth['minecraftUUID'],
			['streak', 'PLAYER', 'VIP', 'PRIME', 'lastRedeem']
		);

		let filteredBulkData: any = {};
		let table: Array<Object> = [];

		// filters the dailyreward: substrings out of the keys
		for (const [key, value] of Object.entries(unfilteredBulkData)) {
			filteredBulkData[key.replace('dailyreward:', '')] = value;
		}

		const time: Moment = moment();
		filteredBulkData.lastRedeem = filteredBulkData.lastRedeem.split(';')[1];

		// Check if player didn't redeem the day before, if so delete the streak.
		if (
			filteredBulkData.lastRedeem !=
				time.subtract(1, 'day').dayOfYear() &&
			filteredBulkData.lastRedeem != time.add(1, 'day').dayOfYear()
		) {
			filteredBulkData.streak = 0;
		}

		for (const [key, value] of Object.entries(filteredBulkData)) {
			if (key in playerRanks) {
				// @ts-ignore value of type unknown
				const nextRedeemableDay = value.split(';')[1];
				const curDayOfYear = moment().dayOfYear();

				let computedStreak: number = filteredBulkData.streak;

				if (filteredBulkData.streak > maxStreak)
					computedStreak = maxStreak;

				// Pushes a new redeemable item to the table
				table.push({
					name: key,
					redeem:
						rankCookies[key] +
						rankCookies[key] * multiplier * computedStreak +
						' COINS',
					isRedeemed: nextRedeemableDay == curDayOfYear + 1,
					isDisabled: auth['globalGroupPriority'] > playerRanks[key]
				});
			}
		}

		// Really ugly way to achieve the order: Player -> VIP -> Prime
		// as the API doesn't return the values sorted by rank.
		table.unshift(table[1]);
		table.unshift(table[1]);
		table.unshift(table[4]);
		for (let i = 0; i < 3; i++) table.pop();

		return new Promise(resolve =>
			resolve({
				data: {
					streak: filteredBulkData.streak,
					apiUri,
					table
				},
				status: { code: 200 }
			})
		);
	} else if (method === 'set') {
		// REMOVE LATER
		return new Promise(resolve => {
			resolve({
				data: {
					message: 'successful'
				},
				status: { code: 200 }
			});
		});
		// REMOVE LATER

		let priorityToAchieve: number = 0;

		// Gets the priority that needs to be achieved (group priority),
		// so that only prime users can redeem prime stuff. So that
		// normal users can't
		for (const [key, value] of Object.entries(playerRanks)) {
			if (key === update) priorityToAchieve = value;
		}

		// Checks if the players priority is valid
		if (auth['globalGroupPriority'] <= priorityToAchieve) {
			const currentTime: Moment = moment();

			// Checks if the player has already redeemed the items.
			// To prevent people spamming http requests and incrementing
			// their balance
			const data = await remVal('get', auth['minecraftUUID'], update);

			if (data.split(';')[1] == currentTime.add(1, 'day').dayOfYear()) {
				return await new Promise(resolve =>
					resolve({ data: {}, status: { code: 400 } })
				);
			} else {
				// Gets the streak
				let streak: any = await remVal(
					'get',
					auth['minecraftUUID'],
					'streak'
				);

				// Gets the day, when it was last redeemed
				const lastRedeem: number = (
					await remVal('get', auth['minecraftUUID'], 'lastRedeem')
				).split(';')[1];

				// Set the day from our date object to the current day again
				currentTime.subtract(1, 'day');

				// as the streak is higher as the max streak, it is set to it.
				let originalStreak = parseInt(streak);
				if (streak > maxStreak) streak = maxStreak;
				let newStreak: number = parseInt(streak) + 1;

				// If the last redeem wasn't today,
				// the streak will be incremented
				if (lastRedeem != currentTime.dayOfYear()) {
					currentTime.subtract(1, 'day');
					// Check if we have to set the streak to 0
					if (lastRedeem != currentTime.dayOfYear()) {
						originalStreak = 0;
						newStreak = 0;
					}
					currentTime.add(1, 'day');

					remVal(
						'set',
						auth['minecraftUUID'],
						'streak',
						(originalStreak + 1).toString()
					);
				}

				// Updates the players cookie amount
				economy(
					'add',
					'COOKIES',
					auth['minecraftUUID'],
					// @ts-ignore update not undefined at this stage
					rankCookies[update] +
						// @ts-ignore Autoformatter ._. same reason as above
						rankCookies[update] * multiplier * newStreak
				);
				remVal(
					'set',
					auth['minecraftUUID'],
					update,
					currentTime.year() +
						';' +
						currentTime.add(1, 'day').dayOfYear()
				);

				// Set the day from our date object to the current day again
				currentTime.subtract(1, 'day');

				remVal(
					'set',
					auth['minecraftUUID'],
					'lastRedeem',
					currentTime.year() + ';' + currentTime.dayOfYear()
				);

				return new Promise(resolve =>
					resolve({
						data: {
							message: 'successful'
						},
						status: { code: 200 }
					})
				);
			}
		} else {
			return new Promise(resolve =>
				resolve({
					data: {
						message: 'priorityToLow'
					},
					status: { code: 400 }
				})
			);
		}
	}

	return new Promise(resolve =>
		resolve({
			data: {
				message: 'unknownMethod'
			},
			status: { code: 500 }
		})
	);
};
