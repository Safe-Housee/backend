import { createConnection } from "../database/connection";
import { listIds, inStatement } from "../utils";
import { generateConvertedData } from "../utils/generateConvertedData";

const addRecord = async (array, tableName, fields, values) => {
	try {
		const database = await createConnection();
		const [rows] = await database.execute(
			`INSERT into ${tableName} (${fields}) VALUES (${values})`
		);
		const pkColumnByTable = {
			tb_usuario: "cd_usuario",
			tb_jogo: "cd_jogo",
			tb_partida: "cd_partida",
			tb_usuarioPartida: "cd_usuario cd_partida",
			tb_honra: "cd_honra",
			tb_honraUsuario: "cd_usuario",
			tb_reporte: "cd_reporte",
		};

		const pkColumn = pkColumnByTable[tableName];
		let valuesInserted = {};
		if (Object.keys(pkColumn).length) {
			const [
				[valueSelected],
			] = await database.execute(
				`SELECT * FROM ${tableName} WHERE ${pkColumn} = ?`,
				[rows.insertId]
			);
			valuesInserted = valueSelected;
		}
		array.push({ id: rows.insertId, ...valuesInserted });
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
		this.honraUsuario = [];
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
		if (this.honraUsuario.length)
			await deleteRecord("tb_honraUsuario", this.honraUsuario, "cd_usuario");
	}

	async addUser(nome = "safeHouse-test", email) {
		const date = new Date();

		email =
			email ||
			`safehouse${date.getMilliseconds() * 1000}-${nome}@safe${
				date.getMilliseconds() * 82
			}.com`;
		nome += date.getMilliseconds() * 1000;
		await addRecord(
			this.users,
			"tb_usuario",
			"nm_usuario, cd_senha, cd_telefone, ds_email, dt_nascimento, ds_endereco",
			`'${nome}', '123', '4002-8922', '${email}', '2020-01-01', 'Rua dos bobos nº 0'`
		);
	}

	async addMatch(name = "testBuilderMatch", gameId = 3) {
		// Tekken 7 game default
		const date = new Date();
		const convertedData = generateConvertedData();
		const hours = `${date.getHours()}:${date.getMinutes()}`;
		await addRecord(
			this.matches,
			"tb_partida",
			"cd_jogo, nm_partida, dt_partida, hr_partida",
			`'${gameId}', '${name}', '${convertedData}', '${hours}'`
		);
	}

	async addMatchUser(
		userId = this.users[0].id,
		matchId = this.matches[0].id,
		criador = false
	) {
		await addRecord(
			this.matchesUsers,
			"tb_usuarioPartida",
			"cd_usuario, cd_partida, cd_criador",
			`${userId}, ${matchId}, ${criador}`
		);
	}

	async addHonraUsuario(
		cdUsuario = this.users[0].id,
		cdHonra = 4,
		qtHonra = 0
	) {
		const date = generateConvertedData();

		await addRecord(
			this.honraUsuario,
			"tb_honraUsuario",
			"cd_usuario, cd_honra, dt_honra, qt_honra",
			`${cdUsuario}, ${cdHonra}, '${date}', ${qtHonra}`
		);
	}
}
