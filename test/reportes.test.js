"use stric";

import request from "supertest";
import app from "../src/app";
import { config } from "./config";
import TestBuilder from "../src/testBuilder/testeBuilder";
import { createConnection } from "../src/database/connection";

describe("Reporte Tests", () => {

	describe('Criação de Reporte', () => {
		const builder = new TestBuilder();
		beforeEach(async () => {
			await builder.addUser();
			await builder.addUser();
		});

		afterEach(async () => {
			await builder.reset();
		});

		it("Deve retornar 400 quando faltar uma informação no reporte", async () => {
			const reporteInfo = {
				nm_reportador: 'cristian',
				nm_reportado: 'xxxxx',
				ds_reporte: "O cara trollou a partida toda"
			};
			delete reporteInfo.nm_reportado;
			await request(app)
				.post("/reporte")
				.set("authorization", config.token)
				.send(reporteInfo)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe("Deve enviar o nome do usuário reportado");
				});
		});
	
	});


});

