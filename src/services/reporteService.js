import { readdir } from "fs/promises";
import fs from "fs";
import crypto from "crypto";
import { resolve } from "path";
import { createConnection } from "../database/connection";

export const criarReporte = async (reporteValues) => {
	try {
		const database = await createConnection();
		const [[cd_reportado]] = await database.execute(
			`
            SELECT cd_usuario FROM tb_usuario WHERE nm_usuario = ?
        `,
			[reporteValues.nm_reportado]
		);
		const [[cd_reportador]] = await database.execute(
			`
            SELECT cd_usuario FROM tb_usuario WHERE nm_usuario = ?
        `,
			[reporteValues.nm_reportador]
		);
		const date = new Date();
		const dataReporte = `${date.getFullYear()}/${date.getMonth()}/${date.getDay()}`;
		const folderName = crypto.randomBytes(16).toString("hex");
		const [insertedReporte] = await database.execute(
			`
            INSERT INTO
                tb_reporte (
                    cd_reportado,
                    cd_reportador,
                    dt_reporte,
                    ds_reporte,
					nm_pastaArquivos
                )
            VALUES (?, ?, ?, ?, ?)
        `,
			[
				cd_reportado.cd_usuario,
				cd_reportador.cd_usuario,
				dataReporte,
				reporteValues.ds_reporte,
				folderName,
			]
		);
		return insertedReporte.insertId;
	} catch (error) {
		console.error(error);
		return new Error(error);
	}
};

export const saveImageIntoReporte = async (filename, id, folderName) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`
			UPDATE tb_reporte 
			SET ds_caminhoImagem = ?,
			nm_pastaArquivos = ?
			WHERE cd_reporte = ?
		`,
			[filename, folderName, id]
		);
		await connection.end();
		return rows;
	} catch (error) {
		console.error(error);
		throw new Error("Error on save reporte image");
	}
};

export const getReporteInfo = async (id) => {
	try {
		const connection = await createConnection();
		const [[rows]] = await connection.query(
			`
			SELECT * 
			FROM tb_reporte 
			WHERE cd_reporte = ?
			`,
			[id]
		);

		await connection.end();
		return rows;
	} catch (error) {
		console.error(error);
		throw new Error("Error on reporte search");
	}
};

export const getFileNames = async (folderName) => {
	try {
		const dir = resolve(
			__dirname,
			"..",
			"..",
			"tmp",
			"uploads",
			"reportes",
			folderName
		);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		const files = await readdir(`tmp/uploads/reportes/${folderName}`);
		const filesNameWhitFolder = files.map((file) => `${folderName}/${file}`);
		return filesNameWhitFolder;
	} catch (error) {
		console.error(error);
		throw new Error("Error on get report images");
	}
};
