"use stric";

import request from "supertest";
import app from "../src/app";
import { config } from "./config";
import TestBuilder from "../src/testBuilder/testeBuilder";
import { createConnection } from "../src/database/connection";
import { statusPartida } from "../src/enum/statusPartida";

describe("MatchController Tests", () => {

	describe('Criação de Partidas', () => {
		const mockData = new TestBuilder();
		beforeEach(async () => {
			await mockData.createConnection();
			await mockData.addUser();
		});
		afterEach(async () => {
			await mockData.reset();
		});
		it("Deve retornar 400 quando faltar uma informação no cadastro", async () => {
			const matchInfo = {
				cd_jogo: 1,
				nm_partida: "Só os mlk bom",
				dt_partida: "12-02-2021",
			};
			await request(app)
				.post("/partidas")
				.set("authorization", config.token)
				.send(matchInfo)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe("Should send Hora da partida");
				});
		});
	
		it("Deve retornar 200 e criar partida no banco de dados", async () => {
			const mockMatch = {
				cd_jogo: 1,
				nm_partida: "Só os mlk bom",
				dt_partida: "12/02/2021",
				hr_partida: "16:01",
				cd_usuario: mockData.users[0].id,
				ds_nivel: "Iniciante"
			};
			await request(app)
				.post("/partidas")
				.set("authorization", config.token)
				.send(mockMatch)
				.expect(201)
				.then((res) => {
					mockData.matches.push({id: res.body.partida.cd_partida, ...res.body.partida})
					expect(res.body.message).toBe("Created");
				});
		});
	});

	describe('Entrar na partida', () => {
		const mockData = new TestBuilder();
		beforeEach(async () => {
			await mockData.createConnection();
			await mockData.addUser();
			await mockData.addMatch('Entrando na partida');
			await mockData.addMatchUser(undefined, undefined, true);
			await mockData.addUser('Joaozinho');
		});
		
		afterEach(async () => {
			await mockData.reset();
		});

		it("Deve adicionar outro usuário a partida", async () => {
			await request(app)
				.patch(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[1].id}`)
				.set("authorization", config.token)
				.expect(200)
				.then(async (res) => {
					const connection = await createConnection();
					const [result] = await connection.execute('select * from tb_usuarioPartida where cd_partida = ? and cd_usuario = ? '
					, [mockData.matches[0].id, mockData.users[1].id]);
					expect(res.body.message).toBe("Ok");
					expect(result[0].cd_usuario).toBe(mockData.users[1].id);
					expect(result[0].cd_partida).toBe(mockData.matches[0].id)
				});
		});

		it('Deve retornar um aviso de partida cheia e setar a partida para fechada', async () => {
			await mockData.addMatchUser(mockData.users[1].id,mockData.matches[0].id);
			await mockData.addUser('Intrometido');
			await request(app)
				.patch(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[2].id}`)
				.set("authorization", config.token)
				.expect(403)
				.then(async(res) => {
					const connection = await createConnection();
					const [result] = await connection.execute('select * from tb_partida where cd_partida = ? '
					, [mockData.matches[0].id]);
					expect(res.body.message).toBe("Partida cheia");
					expect(result[0].ds_status).toBe(statusPartida.FECHADA);
				});
		});
	});

	describe('Sair na partida', () => {
		const mockData = new TestBuilder();
		beforeEach(async () => {
			await mockData.createConnection();
			await mockData.addUser();
			await mockData.addMatch('Saindo da partida');
			await mockData.addMatchUser(null, null, true);
			await mockData.addUser('Joaozinho');
			await mockData.addMatchUser(mockData.users[1].id, null, true);
		});
		
		afterEach(async () => {
			await mockData.reset();
		});

		it("Deve remover usuário da partida", async () => {
			await request(app)
				.patch(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[1].id}/exit`)
				.set("authorization", config.token)
				.expect(200)
				.then(async (res) => {
					const connection = await createConnection();
					const [result] = await connection.execute('select * from tb_usuarioPartida where cd_partida = ? and cd_usuario = ? '
					, [mockData.matches[0].id, mockData.users[1].id]);
					expect(res.body.message).toBe("Ok");
					expect(result[0]).toBeFalsy();
				});
		});
	});

	describe('Listar partidas', () => {
		const mockData = new TestBuilder();
		beforeEach(async () => {
			await mockData.createConnection();
			await mockData.reset();
			await mockData.addUser('William');
			await mockData.addMatch('SÓ LOL SÓ LOL');
			await mockData.addMatchUser(mockData.users[0].id, mockData.matches[0].id, true);
			
			await mockData.addUser('Joao');
			await mockData.addMatch('SDDS DARK SOULS');
			await mockData.addMatchUser(mockData.users[1].id, mockData.matches[1].id, true);
			
			await mockData.addUser('Matheus');
			await mockData.addMatch('QUERIA JOGAR RE');
			await mockData.addMatchUser(mockData.users[2].id, mockData.matches[2].id, true);
			
			await mockData.addUser('Cristian');
			await mockData.addMatch('VO PINAR', 1);
			await mockData.addMatchUser(mockData.users[3].id, mockData.matches[3].id, true);
			
			await mockData.addUser('Ricardo');
			await mockData.addMatch('Joga izi D+');
			await mockData.addMatchUser(mockData.users[4].id, mockData.matches[4].id, true);

			await mockData.addUser('Cristiano');
			await mockData.addMatch('CSGO É izi dms', 2);
			await mockData.addMatchUser(mockData.users[5].id, mockData.matches[5].id, true);

			await mockData.addUser('Jorge123');
			await mockData.addMatchUser(mockData.users[6].id, mockData.matches[5].id);

			await mockData.addHonraUsuario(mockData.users[0].id, 7);
			await mockData.addHonraUsuario(mockData.users[1].id, 6);
			await mockData.addHonraUsuario(mockData.users[2].id, 2);
			await mockData.addHonraUsuario(mockData.users[3].id, 6);
			await mockData.addHonraUsuario(mockData.users[4].id, 1);
			await mockData.addHonraUsuario(mockData.users[5].id, 3);
			await mockData.addHonraUsuario(mockData.users[6].id, 4);
		});
		
		afterEach(async () => {
			await mockData.reset();
		});

		it('Deve listar todas as partidas sem distinção de game quando não for passado nenhum gameId', async () => {
			await request(app)
			.get(`/partidas`)
			.set("authorization", config.token)
			.expect(200)
			.then(res => {
				expect(res.body.partidas.length).toBe(mockData.matches.length);
				expect(res.body.partidas[1].jogadores[0]).toHaveProperty('nm_nivel')
			});
		})

		it("Deve listar todas as partidas de acordo com o game id", async () => {
			await request(app)
				.get(`/partidas?gameId=3`)
				.set("authorization", config.token)
				.expect(200)
				.then(res => {
					expect(res.body.partidas.length).toBe(4);
					expect(res.body.partidas[0].nm_partida).toBe('SÓ LOL SÓ LOL');
					expect(res.body.partidas[0].jogadores.length).toBe(1);
					expect(res.body.partidas[0].limiteUsuarios).toBe(2);
					expect(res.body.partidas[0].usuariosNaPartida).toBe(1);
					expect(res.body.partidas[1].nm_partida).toBe('SDDS DARK SOULS');
					expect(res.body.partidas[2].nm_partida).toBe('QUERIA JOGAR RE');
				});
		});

		it('Deve retornar os dados de uma partida com usuários', async () => {
			await request(app)
				.get(`/partidas/${mockData.matches[0].id}`)
				.set("authorization", config.token)
				.expect(200)
				.then(res => {
					expect(res.body.nm_partida).toBe('SÓ LOL SÓ LOL');
					expect(res.body.jogadores.length).toBe(1);
					expect(res.body.limiteUsuarios).toBe(2);
					expect(res.body.usuariosNaPartida).toBe(1);
					expect(res.body.ds_status).toBe('ABERTA');
				});
		});

		it('Deve pesquisar partidas por nome', async () => {
			await request(app)
				.get(`/partidas?name=izi`)
				.set("authorization", config.token)
				.expect(200)
				.then(res => {
					expect(res.body.partidas.length).toBe(2);
					expect(res.body.partidas[0].nm_partida).toBe(mockData.matches[4].nm_partida);
					expect(res.body.partidas[1].nm_partida).toBe(mockData.matches[5].nm_partida);
				});
		});

		it('Deve listar sala por sala vazia', async () => {
			await request(app)
				.get(`/partidas?empty=true`)
				.set("authorization", config.token)
				.expect(200)
				.then(res => {
					expect(res.body.partidas.length).toBe(5);
				});
		});

		it('Deve listar por game e sala vazias', async () => {
			await request(app)
				.get(`/partidas?empty=true&gameId=3`)
				.set("authorization", config.token)
				.expect(200)
				.then(res => {
					expect(res.body.partidas.length).toBe(4);
				});
		});
	});

	describe('Status da partida', () => {
		const mockData = new TestBuilder();
		beforeEach(async () => {
			await mockData.createConnection();
			await mockData.reset();
			await mockData.addUser('Tucks');
			await mockData.addHonraUsuario(mockData.users[0].id, 7);
			await mockData.addMatch('SÓ LOL SÓ LOL', undefined, statusPartida.FINALIDA);
		});
		
		afterEach(async () => {
			await mockData.reset();
		});

		it('Deve retornar uma mensagem se a partida estiver com status diferente de ABERTA', async () => {
			await request(app)
				.patch(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[0].id}`)
				.set("authorization", config.token)
				.expect(403)
				.then(res => {
					expect(res.body.message).toBe('Não é possivel entrar nessa partida');
				});
		});

		it('Deve atualizar o status da partida', async () => {
			await request(app)
				.patch(`/partidas/${mockData.matches[0].id}/status/${statusPartida.ANDAMENTO}`)
				.set("authorization", config.token)
				.expect(200)
				.then(res => {
					expect(res.body.partida.ds_status).toBe(statusPartida.ANDAMENTO);
				});
		});
	});
});
