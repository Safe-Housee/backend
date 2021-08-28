/* eslint-disable no-await-in-loop */
/* eslint-disable consistent-return */
/* eslint-disable-next-line consistent-return */
/* eslint-disable-next-line prefer-const */
/* eslint-disable-next-line no-await-in-loop */

import { createConnection } from "../database/connection";
import { serializeData } from "../utils/serializeDataToMysql";
import { Partida } from "../entities";
import { Jogador } from "../entities/Player";

export const createMatch = async (match) => {
	const connection = await createConnection();
	try {
		const {
			nm_partida,
			cd_jogo,
			dt_partida,
			hr_partida,
			cd_usuario,
			ds_nivel,
		} = match;
		const serializedData = serializeData(dt_partida);
		await connection.beginTransaction();
		const [result] = await connection.execute(
			`
            insert into tb_partida (
                cd_jogo,
                nm_partida,
                dt_partida,
                hr_partida,
				ds_nivel
            ) values (?, ?, ?, ?, ?)
        `,
			[
				cd_jogo,
				nm_partida,
				`${serializedData} ${hr_partida}`,
				hr_partida,
				ds_nivel,
			]
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
		const [partida] = await connection.execute(
			`SELECT
				*
			FROM 
				tb_partida
			WHERE 
				cd_partida = ?`,
			[result.insertId]
		);
		await connection.commit();
		await connection.end();
		return partida[0];
	} catch (error) {
		await connection.rollback();
		await connection.end();
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

export const getJogadores = async (partidaId) => {
	try {
		const connection = await createConnection();
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
		const jogadoresFormatados = [];
		for (const jogador of jogadores) {
			const [nivelJogador] = await connection.execute(
				`
				SELECT
					*
				FROM
					tb_honraUsuario thb
				INNER JOIN tb_honra th
				ON th.cd_honra = thb.cd_honra
				WHERE thb.cd_usuario = ?`,
				[jogador.cd_usuario]
			);
			jogadoresFormatados.push(new Jogador(jogador, nivelJogador[0]).json());
		}
		await connection.end();
		return jogadoresFormatados;
	} catch (error) {
		console.error(error);
	}
};

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
		for (const partida of partidas) {
			const jogadores = await getJogadores(partida.cd_partida);
			partida.jogadores = [...jogadores];

			const [gameInfo] = await connection.execute(
				`
			select *
			from tb_jogo 
			where cd_jogo = ?`,
				[partida.cd_jogo]
			);

			const partidaFormatada = new Partida(gameInfo[0], partida);
			partidasFormatada.push(partidaFormatada.json());
		}

		await connection.end();
		return partidasFormatada;
	} catch (error) {
		console.error(error);
	}
};

export const getMatchesByGameId = async (cdJogo, empty) => {
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

		for (const partida of partidas) {
			const jogadores = await getJogadores(partida.cd_partida);
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

		let partidasFormatada = [];
		partidas.forEach((partida) => {
			const partidaFormatada = new Partida(gameInfo[0], partida);
			partidasFormatada.push(partidaFormatada.json());
		});

		if (empty) {
			partidasFormatada = partidasFormatada.filter(
				(partida) => partida.usuariosNaPartida === 1
			);
		}

		return partidasFormatada;
	} catch (error) {
		console.error(error);
	}
};

export const updateStatusMatch = async (cdPartida, statusPartida) => {
	const connection = await createConnection();
	try {
		await connection.execute(
			`update tb_partida set ds_status = '${statusPartida}' where cd_partida = ?`,
			[cdPartida]
		);
		await connection.end();
	} catch (error) {
		await connection.end();
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

		const jogadores = await getJogadores(partida.cd_partida);
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

export const getMatchesByName = async (name) => {
	const connection = await createConnection();
	try {
		const [partidas] = await connection.execute(
			`
			SELECT
			*
			FROM
				tb_partida tp
			INNER JOIN tb_jogo tj ON
				tj.cd_jogo = tp.cd_jogo
			WHERE
				tp.nm_partida LIKE '%${name}%';
		`
		);
		const partidasFormatada = [];
		for (const partida of partidas) {
			const jogadores = await getJogadores(partida.cd_partida);
			partida.jogadores = [...jogadores];

			const [gameInfo] = await connection.execute(
				`
			select *
			from tb_jogo 
			where cd_jogo = ?`,
				[partida.cd_jogo]
			);

			const partidaFormatada = new Partida(gameInfo[0], partida);
			partidasFormatada.push(partidaFormatada.json());
		}
		await connection.end();
		return partidasFormatada;
	} catch (error) {
		console.error(error);
	}
};

export const getMatchesEmpty = async () => {
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
		for (const partida of partidas) {
			const jogadores = await getJogadores(partida.cd_partida);
			partida.jogadores = [...jogadores];

			const [gameInfo] = await connection.execute(
				`
			select *
			from tb_jogo 
			where cd_jogo = ?`,
				[partida.cd_jogo]
			);

			const partidaFormatada = new Partida(gameInfo[0], partida);
			partidasFormatada.push(partidaFormatada.json());
		}
		const partidasVazias = partidasFormatada.filter(
			(partida) => partida.usuariosNaPartida === 1
		);
		await connection.end();
		return partidasVazias;
	} catch (error) {
		console.error(error);
	}
};
