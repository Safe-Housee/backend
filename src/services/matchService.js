import { createConnection } from "../database/connection";
import { serializeData } from "../utils/serializeDataToMysql";

export const createMatch = async (match) => {
	const connection = await createConnection();
	try {
		const { nm_partida, cd_jogo, dt_partida, hr_partida, cd_usuario } = match;
		const serializedData = serializeData(dt_partida);
		const [result] = await connection.execute(
			`
            insert into tb_partida (
                cd_jogo,
                nm_partida,
                dt_partida,
                hr_partida
            ) values (?, ?, ?, ?)
        `,
			[cd_jogo, nm_partida, `${serializedData} ${hr_partida}`, hr_partida]
		);
		await connection.execute(
			`
            insert into tb_usuarioPartida (
                cd_usuario,
                cd_partida,
                cd_criador
            ) values (?, ?, ?)
        `,
			[cd_usuario, result.insertId, true]
		);
	} catch (error) {
		console.error(error);
	}
};

export const insertUserOnMatch = async (cdPartida, cdUsuario) => {
	const connection = await createConnection();
	try {
		await connection.execute(
			`
			insert into tb_usuarioPartida (
				cd_usuario,
				cd_partida,
				cd_criador
			) values (?, ?, ?)
		`,
			[cdUsuario, cdPartida, false]
		);
	} catch (error) {
		console.error(error);
	}
};
