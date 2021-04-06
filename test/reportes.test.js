"use stric";

import request from "supertest";
import app from "../src/app";
import { config } from "./config";
import TestBuilder from "../src/testBuilder/testeBuilder";
import { createConnection } from "../src/database/connection";

describe("Reporte Tests", () => {

	describe('Criação de Reporte', () => {

		it("Deve retornar 400 quando faltar uma informação no reporte", async () => {
			const reporteInfo = {
				cd_reportador: 1,
				cd_reportado: 2,
				ds_reporte: "O cara trollou a partida toda"
			};
			delete reporteInfo.cd_reportado;
			await request(app)
				.post("/reporte")
				.set("authorization", config.token)
				.send(reporteInfo)
				.expect(400)
				.then((res) => {
					expect(res.body.message).toBe("Should send código do usuário reportado");
				});
		});
	
	});


});

