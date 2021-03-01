import { createConnection } from "../database/connection";
import { listIds, inStatement } from "../utils";

const addRecord = async (array, tableName, fields, values) => {
	try {
		const database = await createConnection();
		const [rows] = await database.execute(
			`insert into ${tableName} (${fields}) VALUES (${values})`
		);

		array.push({ id: rows.insertId });
	} catch (error) {
		console.error(error);
	}
};

const deleteRecord = async (tableName, list, propertyName) => {
	const database = await createConnection();
	propertyName = propertyName || "id";
	const ids = listIds(list);
	await database.execute(
		`delete from ${tableName} where ${propertyName} ${inStatement(ids)}`,
		ids
	);
};
export default class TestBuilder {
	constructor() {
		this.users = [];
		this.matches = [];
		this.matchesUsers = [];
	}

	async reset() {
		await this.resetDb();
		this.resetArrays();
	}

	resetArrays() {
		for (const array of Object.keys(this)) {
			this[array] = [];
		}
	}

	async resetDb() {
		if (this.users.length)
			await deleteRecord("tb_usuario", this.users, "cd_usuario");
		if (this.matches.length)
			await deleteRecord("tb_partida", this.matches, "cd_partida");
		if (this.matchesUsers.length)
			await deleteRecord("tb_usuarioPartida", this.matchesUsers, "cd_usuario");
	}

	async addUser(nome, email) {
		const date = new Date();
		nome = nome || "safeHouse-test";

		email =
			email ||
			`safehouse${date.getMilliseconds() * 1000}@safe${
				date.getMilliseconds() * 82
			}.com`;
		await addRecord(
			this.users,
			"tb_usuario",
			"nm_usuario, cd_senha, cd_telefone, ds_email, dt_nascimento, ds_endereco",
			`'${nome}', '123', '4002-8922', '${email}', '2020-01-01', 'Rua dos bobos nº 0'`
		);
	}

	async addMatch(name, gameId) {
		const nomePartida = name || "testBuilderMatch";
		const cd_jogo = gameId || 3; // Tekken 7
		const date = new Date();
		const convertedData = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
		const hours = `${date.getHours()}:${date.getMinutes()}`;
		await addRecord(
			this.matches,
			"tb_partida",
			"cd_jogo, nm_partida, dt_partida, hr_partida",
			`'${cd_jogo}', '${nomePartida}', '${convertedData}', '${hours}'`
		);
	}

	async addMatchUser(userId, matchId, criador = false) {
		const cd_usuario = userId || this.users[0].id;
		const cd_partida = matchId || this.matches[0].id;

		await addRecord(
			this.matchesUsers,
			"tb_usuarioPartida",
			"cd_usuario, cd_partida, cd_criador",
			`${cd_usuario}, ${cd_partida}, ${criador}`
		);
	}
}
