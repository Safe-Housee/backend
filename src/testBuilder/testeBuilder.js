import { createConnection } from "../database/connection";
import { listIds, inStatement } from "../utils";

const addRecord = async (array, tableName, fields, values) => {
	const database = await createConnection();
	const [rows] = await database.execute(
		`insert into ${tableName} (${fields}) VALUES (${values})`
	);
	array.push({ id: rows.insertId });
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
			`'${email}', '123', '4002-8922', '${email}', '2020-01-01', 'Rua dos bobos nº 0'`
		);
	}
}
