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
		await connection.end();
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
		await connection.end();
	} catch (error) {
		console.error(error);
	}
};

export const removeUserFromMatch = async (cdPartida, cdUsuario) => {
	const connection = await createConnection();
	try {
		await connection.execute(
			`
			delete from tb_usuarioPartida where cd_partida = ? and cd_usuario = ?
		`,
			[cdPartida, cdUsuario]
		);
		await connection.end();
	} catch (error) {
		console.error(error);
	}
};

// eslint-disable-next-line consistent-return
export const getMatches = async (cdJogo) => {
	const connection = await createConnection();
	try {
		const [matches] = await connection.execute(
			`
			select * 
			from tb_partida tp 
			where tp.cd_jogo = ?;
		`,
			[cdJogo]
		);

		// eslint-disable-next-line prefer-const
		for (let match of matches) {
			// eslint-disable-next-line no-await-in-loop
			const [jogadores] = await connection.execute(
				`
				select
					tu.nm_usuario,
					tu.ds_email,
					tu.cd_usuario
				from
					tb_usuarioPartida tup2
				inner join tb_usuario tu 
				on tu.cd_usuario = tup2.cd_usuario 
				where tup2.cd_partida = ?;
			`,
				[match.cd_partida]
			);
			match.jogadores = [...jogadores];
		}

		const gameInfo = await connection.execute(
			`
		select *
		from tb_jogo where cd_jogo = ?`,
			[cdJogo]
		);
		console.log(gameInfo);
		await connection.end();
		const partida = new Partida(gameInfo, matches);

		return matches;
	} catch (error) {
		console.error(error);
	}
};
