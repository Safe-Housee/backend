import imageToBase64 from "image-to-base64";
import { readdir } from "fs/promises";
import fs from "fs";
import crypto from "crypto";
import { resolve } from "path";
import { createConnection } from "../database/connection";
import { generateConvertedData } from "../utils/generateConvertedData";

export const criarReporte = async (reporteValues) => {
	try {
		const database = await createConnection();
		const [[cd_reportado]] = await database.execute(
			`
            SELECT cd_usuario FROM tb_usuario WHERE nm_usuario = ?
        `,
			[reporteValues.nm_reportado]
		);
		if (!cd_reportado?.cd_usuario) {
			return "Usuário reportado deve existir";
		}
		const [[cd_reportador]] = await database.execute(
			`
            SELECT cd_usuario FROM tb_usuario WHERE nm_usuario = ?
        `,
			[reporteValues.nm_reportador]
		);
		const dataReporte = generateConvertedData();
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

export const saveImageIntoReporte = async (filename, id) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`
			UPDATE tb_reporte 
			SET ds_caminhoImagem = ?
			WHERE cd_reporte = ?
		`,
			[filename, id]
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
			"files",
			"uploads",
			"reportes",
			`${process.env.NODE_ENV}-${folderName}`
		);
		let createdDir = false;
		if (!fs.existsSync(dir)) {
			createdDir = true;
			fs.mkdirSync(dir);
		}

		const files = await readdir(dir);

		const filesNameWhitFolder = [];
		if (files.length && !createdDir) {
			for (const file of files) {
				const pathToFile = resolve(
					"files",
					"uploads",
					"reportes",
					`${process.env.NODE_ENV}-${folderName}`,
					file
				);
				// eslint-disable-next-line no-return-assign
				filesNameWhitFolder.push(imageToBase64(pathToFile));
			}
		}
		return Promise.all(filesNameWhitFolder);
	} catch (error) {
		console.error(error);
		throw new Error("Error on get report images");
	}
};

export const listReportes = async (status) => {
	try {
		const connection = await createConnection();
		const [rows] = await connection.query(
			`
			SELECT
				cd_reporte,
				cd_reportado,
				cd_reportador,
				cd_avaliador,
				ds_statusReporte,
				ds_reporte,
				dt_reporte
			FROM
				tb_reporte
			WHERE
				ds_statusReporte = ?
		`,
			[status]
		);

		await connection.end();
		return rows;
	} catch (error) {
		console.error(error);
		throw new Error("Error on list report");
	}
};
