import crypto from "crypto";
import { createConnection } from "../database/connection";
import { statusPartida } from "../enum/statusPartida";
import { listIds, inStatement } from "../utils";
import { generateConvertedData } from "../utils/generateConvertedData";

let database;
// eslint-disable-next-line no-return-assign
const createCon = async () => (database = await createConnection());

const addRecord = async (array, tableName, fields, values) => {
	try {
		const [rows] = await database.execute(
			`INSERT into ${tableName} (${fields}) VALUES (${values})`
		);
		const pkColumnByTable = {
			tb_usuario: "cd_usuario",
			tb_jogo: "cd_jogo",
			tb_partida: "cd_partida",
			tb_usuarioPartida: "cd_partida",
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
		this.reportes = [];
	}

	async reset() {
		await this.resetDb();
		this.resetArrays();
	}

	async createConnection() {
		await createCon();
	}

	resetArrays() {
		for (const array of Object.keys(this)) {
			this[array] = [];
		}
	}

	async resetDb() {
		if (this.reportes.length)
			await deleteRecord("tb_reporte", this.reportes, "cd_reporte");
		if (this.users.length)
			await deleteRecord("tb_usuario", this.users, "cd_usuario");
		if (this.matches.length)
			await deleteRecord("tb_partida", this.matches, "cd_partida");
		if (this.matchesUsers.length)
			await deleteRecord("tb_usuarioPartida", this.matchesUsers, "cd_usuario");
		if (this.honraUsuario.length)
			await deleteRecord("tb_honraUsuario", this.honraUsuario, "cd_usuario");
	}

	async addReporte(
		cdReportado = this.users[0].id,
		cdReportador = this.users[1].id,
		date = generateConvertedData(),
		ds_reporte = "foi sacana",
		ds_caminhoImagem = null,
		nm_pastaArquivos = crypto.randomBytes(16).toString("hex")
	) {
		await addRecord(
			this.reportes,
			"tb_reporte",
			"cd_reportado, cd_reportador, dt_reporte, ds_reporte, ds_caminhoImagem, nm_pastaArquivos",
			`${cdReportado}, ${cdReportador}, '${date}', '${ds_reporte}', '${ds_caminhoImagem}', '${nm_pastaArquivos}'`
		);
	}

	async addUser(nome, email, icBloqueado = 0, dtDesbloqueio) {
		const date = new Date();
		const hash = crypto.randomBytes(16).toString("hex");
		const fakeEmail = `safehouse${hash}-${nome}@safe${date.getMilliseconds()}.com`;

		email = email || fakeEmail;
		nome = nome || `safeHouse-test${crypto.randomBytes(16).toString("hex")}`;
		dtDesbloqueio = dtDesbloqueio || null;
		await addRecord(
			this.users,
			"tb_usuario",
			"nm_usuario, cd_senha, cd_telefone, ds_email, dt_nascimento, ds_endereco, ic_bloqueado, dt_desbloqueio",
			`'${nome}', '123', '4002-8922', '${email}', '2020-01-01', 'Rua dos bobos nº 0', ${icBloqueado}, ${dtDesbloqueio}`
		);
	}

	async addMatch(
		name = "testBuilderMatch",
		gameId = 3,
		status = statusPartida.ABERTA
	) {
		// Tekken 7 game default
		const date = new Date();
		const convertedData = generateConvertedData();
		const hours = `${date.getHours()}:${date.getMinutes()}`;
		await addRecord(
			this.matches,
			"tb_partida",
			"cd_jogo, nm_partida, dt_partida, hr_partida, ds_status",
			`'${gameId}', '${name}', '${convertedData}', '${hours}', '${status}'`
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
