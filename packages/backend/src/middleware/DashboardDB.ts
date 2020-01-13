import mysql, { Connection, MysqlError } from 'mysql';
import dotenv from 'dotenv';

dotenv.config();

// Creates a new pool from env variables
const pool = mysql.createPool({
	connectionLimit: parseInt(process.env.DASHBOARD_CONNECTION_LIMIT as string),
	host: process.env.DASHBOARD_HOST,
	user: process.env.DASHBOARD_USER,
	password: process.env.DASHBOARD_PASSWORD,
	database: process.env.DASHBOARD_DATABASE,
	debug: false
});

// Sends a SQL query to the database.
// Gets a new connection for each query,
// from the connection pool.
export const query = (query: string): any => {
	return new Promise((resolve?, reject?): void => {
		pool.getConnection((connErr: MysqlError, connection: Connection) => {
			console.log(
				'Connection from dashboard pool: ' + connection.threadId
			);
			if (connErr) return reject(connErr);

			connection.query(query, (queryErr: MysqlError, data: any): void => {
				if (queryErr) return reject(queryErr);
				return resolve(data);
			});
			// @ts-ignore typings incomplete
			connection.release();
		});
	});
};

export const escape = (value: string): string => {
	return pool.escape(value);
};

export default pool;
