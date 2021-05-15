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
		const [insertedReporte] = await database.execute(
			`
            INSERT INTO
                tb_reporte (
                    cd_reportado,
                    cd_reportador,
                    dt_reporte,
                    ds_reporte
                )
            VALUES (?, ?, ?, ?)
        `,
			[
				cd_reportado.cd_usuario,
				cd_reportador.cd_usuario,
				dataReporte,
				reporteValues.ds_reporte,
			]
		);
		return insertedReporte.insertId;
	} catch (error) {
		console.error(error);
		return new Error(error);
	}
};
