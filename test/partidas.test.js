"use stric";

import request from "supertest";
import app from "../src/app";
import { config } from "./config";
import TestBuilder from "../src/testBuilder/testeBuilder";
import { createConnection } from "../src/database/connection";

describe("MatchController Tests", () => {

	describe('Criação de Partidas', () => {
		let mockData = null;
		beforeEach(async () => {
			mockData = new TestBuilder();
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
			};
			await request(app)
				.post("/partidas")
				.set("authorization", config.token)
				.send(mockMatch)
				.expect(201)
				.then((res) => {
					expect(res.body.message).toBe("Created");
				});
		});
	});

	describe('Entrar na partida', () => {
		let mockData = null;
		beforeEach(async () => {
			mockData = new TestBuilder();
			await mockData.addUser();
			await mockData.addMatch();
			await mockData.addMatchUser(null, null, true);
			await mockData.addUser('Joaozinho');
		});
		
		afterEach(async () => {
			await mockData.reset();
		});

		it("Deve retornar 400 caso falte alguma info no banco", async () => {
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
	});

});
