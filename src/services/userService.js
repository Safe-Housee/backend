import bcrypt from "bcrypt";
import imageToBase64 from "image-to-base64";
import { resolve } from "path";
import auth from "../config/auth";
import { createConnection } from "../database/connection";
import { serializeData } from "../utils/serializeDataToMysql";

export const createUser = async ({
	nome,
	email,
	senha,
	nascimento,
	endereco,
	telefone,
}) => {
	try {
		const connection = await createConnection();
		const senhaHash = bcrypt.hashSync(senha, auth.salt);
		const novaData = serializeData(nascimento);
		const [rows] = await connection.query(
			`INSERT INTO tb_usuario (
				nm_usuario, 
				cd_senha, 
				cd_telefone, 
				ds_email, 
				dt_nascimento, 
				ds_endereco) 
        	VALUES (?, ?, ?, ?, ?, ?);`,
			[nome, senhaHash, telefone, email, novaData, endereco]
		);

		await connection.query(
			`INSERT INTO tb_honraUsuario(
				cd_usuario, 
				dt_honra,
				cd_honra
			) VALUES (?, ?, (
			SELECT 
				tbh.cd_honra as cd_honra
			FROM tb_honra tbh 
			WHERE tbh.nm_nivel = 'Desconhecido')
			)`,
			[rows.insertId, novaData]
		);

		const [[userInfo]] = await connection.query(
			`
				SELECT 
					tbu.nm_usuario,
					tbu.ds_email,
					tbh.nm_nivel
				FROM tb_usuario tbu
				INNER JOIN tb_honraUsuario tbhu
					ON tbhu.cd_usuario = tbu.cd_usuario
				INNER JOIN tb_honra tbh
					ON tbh.cd_honra = tbhu.cd_honra
				WHERE tbu.cd_usuario = ?
		`,
			[rows.insertId]
		);

		return userInfo;
	} catch (error) {
		console.error(error);
		throw new Error("Error on insert in tb_usuario");
	}
};

export const checkEmail = async (email) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`SELECT 
				* 
			FROM 
				tb_usuario tu 
			WHERE 
				tu.ds_email = ?`,
			[email]
		);
		await connection.end();
		return rows.length;
	} catch (error) {
		console.error(error);
		throw new Error("Error on check email");
	}
};

export const checkUser = async (user) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`SELECT 
				* 
			FROM 
				tb_usuario tu 
			WHERE 
				tu.nm_usuario = ?`,
			[user]
		);
		await connection.end();
		return rows.length;
	} catch (error) {
		console.error(error);
		throw new Error("Error on check USER");
	}
};

export const returnUser = async (cd_usuario) => {
	try {
		const connection = await createConnection();

		const sql = `SELECT * FROM tb_usuario WHERE cd_usuario = ?`;
		const values = [cd_usuario];
		const [result] = await connection.execute(sql, values);

		connection.end();

		return result;
	} catch (error) {
		console.error(error);
		throw new Error("Erro ao pesquisar usuario");
	}
};

export const returnOneUser = async (cd_usuario) => {
	try {
		const connection = await createConnection();

		const sql = `SELECT * FROM tb_usuario WHERE cd_usuario = ?`;
		const values = [cd_usuario];
		const [[result]] = await connection.execute(sql, values);
		const userInfo = result;

		if (result?.ds_caminhoImagem) {
			const pathToFile = resolve(
				"files",
				"uploads",
				"perfil",
				result.ds_caminhoImagem
			);
			// eslint-disable-next-line no-return-assign
			imageToBase64(pathToFile)
				.then((res) => {
					userInfo.profileImage = res;
				})
				.catch((error) => console.error(error));
		}

		await connection.end();
		return userInfo;
	} catch (error) {
		console.error(error);
		throw new Error("Erro ao pesquisar usuario");
	}
};

export const updateUser = async (user) => {
	try {
		const connection = await createConnection();

		const [rows] = await connection.execute(
			`UPDATE tb_usuario SET 
				nm_usuario = ?,
				ds_email = ?,
				cd_senha = ?,
				dt_nascimento = ?,
				ds_endereco = ?,
				cd_telefone = ?
			WHERE cd_usuario = ?;`,
			[
				user[0].nm_usuario,
				user[0].ds_email,
				user[0].cd_senha,
				user[0].dt_nascimento,
				user[0].ds_endereco,
				user[0].cd_telefone,
				user[0].cd_usuario,
			]
		);

		connection.end();

		return rows;
	} catch (error) {
		console.error(error);
		throw new Error("Erro ao pesquisar usuario");
	}
};

export const getUser = async (email) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`SELECT 
				* 
			FROM 
				tb_usuario tu 
			WHERE 
				tu.ds_email = ?`,
			[email]
		);
		await connection.end();
		return rows;
	} catch (error) {
		console.error(error);
		throw new Error("Error on check email");
	}
};

export const saveImageIntoUser = async (filename, id) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`
			UPDATE tb_usuario 
			SET ds_caminhoImagem = ? 
			WHERE cd_usuario = ?
		`,
			[filename, id]
		);
		await connection.end();
		return rows;
	} catch (error) {
		console.error(error);
		throw new Error("Error on save user image");
	}
};
