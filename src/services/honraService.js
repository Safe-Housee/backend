/* eslint-disable consistent-return */
import { createConnection } from "../database/connection";
import { honras } from "../enum/niveisHonra";

export const updateHonra = async ({ cdUsuario, avaliacaoTipo }) => {
	const connection = await createConnection();
	try {
		const [[usuario]] = await connection.execute(
			`
            SELECT *
            FROM tb_honraUsuario
            WHERE cd_usuario = ?`,
			[cdUsuario]
		);
		let { qt_honra } = usuario;
		if (avaliacaoTipo === "positiva") qt_honra++;

		if (avaliacaoTipo === "negativa") qt_honra--;

		const honra = honras.find(
			(honra) => qt_honra >= Number(honra.ds_faixaDePonto)
		);

		await connection.query(
			`
            UPDATE tb_honraUsuario
            SET qt_honra = ?, 
                cd_honra = ?
            WHERE cd_usuario = ?
        `,
			[qt_honra, honra.cd_honra, cdUsuario]
		);

		const [[infoToReturn]] = await connection.query(
			`
            SELECT 
                tbh.nm_nivel,
                tbh.ds_imagenHonra,
                tbhu.qt_honra
            FROM tb_honraUsuario tbhu
            INNER JOIN tb_honra tbh 
                ON tbh.cd_honra = tbhu.cd_honra
            WHERE tbhu.cd_usuario = ?
        `,
			[cdUsuario]
		);

		await connection.end();
		return infoToReturn;
	} catch (error) {
		console.error(error);
	}
};
