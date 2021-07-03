/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
import { createConnection } from "../database/connection";
import { serializeData } from "../utils/serializeDataToMysql";
import { Partida } from "../entities";

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
export const getMatches = async () => {
	const connection = await createConnection();
	try {
		const [partidas] = await connection.execute(
			`
			select * 
			from tb_partida tp 
			inner join tb_jogo tj
			on tj.cd_jogo = tp.cd_jogo
		`
		);
		const partidasFormatada = [];
		// eslint-disable-next-line prefer-const
		for (let partida of partidas) {
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
				[partida.cd_partida]
			);
			partida.jogadores = [...jogadores];

			const [gameInfo] = await connection.execute(
				`
			select *
			from tb_jogo 
			where cd_jogo = ?`,
				[partida.cd_jogo]
			);

			partidas.forEach((partida) => {
				const partidaFormatada = new Partida(gameInfo[0], partida);
				partidasFormatada.push(partidaFormatada.json());
			});
		}
		await connection.end();

		return partidasFormatada;
	} catch (error) {
		console.error(error);
	}
};

// eslint-disable-next-line consistent-return
export const getMatchesByGameId = async (cdJogo) => {
	const connection = await createConnection();
	try {
		const [partidas] = await connection.execute(
			`
			select * 
			from tb_partida tp 
			where tp.cd_jogo = ?;
		`,
			[cdJogo]
		);

		// eslint-disable-next-line prefer-const
		for (let partida of partidas) {
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
				[partida.cd_partida]
			);
			partida.jogadores = [...jogadores];
		}

		const [gameInfo] = await connection.execute(
			`
		select *
		from tb_jogo 
		where cd_jogo = ?`,
			[cdJogo]
		);
		await connection.end();

		const partidasFormatada = [];
		partidas.forEach((partida) => {
			const partidaFormatada = new Partida(gameInfo[0], partida);
			partidasFormatada.push(partidaFormatada.json());
		});
		return partidasFormatada;
	} catch (error) {
		console.error(error);
	}
};

export const getPartida = async (partidaId) => {
	const connection = await createConnection();
	try {
		const [[partida]] = await connection.execute(
			`
			select * 
			from tb_partida tp 
			where tp.cd_partida = ?;
		`,
			[partidaId]
		);

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
			[partidaId]
		);
		partida.jogadores = jogadores;
		const [gameInfo] = await connection.execute(
			`
			select
				tj.cd_jogo ,
				tj.ds_categoria ,
				tj.ds_desenvolvedora ,
				tj.ds_faixaEtaria ,
				tj.ds_maxPlayers ,
				tj.dt_lancamento ,
				tj.nm_jogo
			from
				tb_partida tp
			inner join tb_jogo tj on
				tj.cd_jogo = tp.cd_jogo
			where
				tp.cd_partida = ?`,
			[partidaId]
		);
		await connection.end();
		const partidaFormatada = new Partida(gameInfo[0], partida);
		return partidaFormatada.json();
	} catch (error) {
		console.error(error);
	}
};
