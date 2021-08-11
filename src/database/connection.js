import mysql from "mysql2/promise";

export async function createConnection() {
	const connection = await mysql.createConnection({
		host: "remotemysql.com",
		user: "bYD4ZDMsh1",
		password: "FgOmcxE5NS",
		database: "bYD4ZDMsh1",
	});
	return connection;
}
