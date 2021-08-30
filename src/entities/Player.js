export class Jogador {
	constructor(jogadorInfo, honraInfo) {
		this.jogadorInfo = jogadorInfo;
		this.honraInfo = honraInfo;
	}

	json() {
		return {
			...this.honraInfo,
			...this.jogadorInfo,
			donoPartida: !!this.jogadorInfo.cd_criador,
		};
	}
}
