export class Partida {
	constructor(gameInfo, partidaInfo) {
		this.game = gameInfo;
		this.partida = partidaInfo;
	}

	json() {
		return {
			...this.partida,
			limiteUsuarios: Number(this.game.ds_maxPlayers) * 2,
			usuariosNaPartida: this.partida.jogadores.length,
		};
	}
}
