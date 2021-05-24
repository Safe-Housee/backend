"use stric";

import request from "supertest";
import app from "../src/app";
import { config } from "./config";
import TestBuilder from "../src/testBuilder/testeBuilder";
import { createConnection } from "../src/database/connection";

describe("Reporte Tests", () => {


	const builder = new TestBuilder();
	beforeEach(async () => {
		await builder.addUser();
		await builder.addUser();
	});

	afterEach(async () => {
		await builder.reset();
	});

	describe('Post', () => {

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

		it('Deve criar um reporte no banco de dados', async () => {
			const reporteInfo = {
				nm_reportador: builder.users[0].nm_usuario,
				nm_reportado: builder.users[1].nm_usuario,
				ds_reporte: "O cara trollou a partida toda"
			};
			await request(app)
				.post("/reporte")
				.set("authorization", config.token)
				.send(reporteInfo)
				.expect(201)
				.then((res) => {
					expect(res.body.cd_reporte).toBeTruthy();
					expect(res.body.nm_reportado).toBe(reporteInfo.nm_reportado);
					expect(res.body.nm_reportador).toBe(reporteInfo.nm_reportador);
					expect(res.body.ds_reporte).toBe(reporteInfo.ds_reporte);
				});
		});
	});

	fdescribe('GET', () => {
		it('Deve retornar um reporte por cd_reporte', async () => {
			await builder.addReporte();
			await request(app)
			.get(`/reporte/${builder.reportes[0].cd_reporte}`)
			.set("authorization", config.token)
			.expect(200)
			.then((res) => {
				console.log(JSON.stringify(res.body, null, 2));
				expect(res.body.cd_reporte).toBe(builder.reportes[0].cd_reporte);
				expect(Object.keys(res.body.reportador).length).toBeGreaterThan(0)
				expect(Object.keys(res.body.reportado).length).toBeGreaterThan(0);
				expect(res.body.ds_reporte).toBe(builder.reportes[0].ds_reporte);
				// expect(res.body.arquivos.length).toBeGreaterThan(0);
			});
		});
	});


});

