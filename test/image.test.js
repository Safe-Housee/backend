'use stric';

import request from 'supertest';
import { rm, readdir, rmdir } from "fs/promises";
import app from '../src/app';
import TestBuilder from "../src/testBuilder/testeBuilder";
import { config } from "./config";
import { createConnection } from '../src/database/connection';

describe("Upload de imagem de Perfil", () => {
	const builder = new TestBuilder();
	beforeEach(async () => {
		await builder.addUser('imageUserTest');
	});
	afterAll(async () => {
		await builder.reset();
		const files = await readdir('files/uploads/perfil')
		const filesToDeleted = files.filter(filename => filename.indexOf('test') >= 0);
		for (const file of filesToDeleted) {
			await rm(`files/uploads/perfil/${file}`);
		}  		
	});

	describe('Usuarios', () => {

		it('Deve existir uma rota para upload de imagens', async () => {
			await request(app)
				.post(`/uploadImage`)
				.set("authorization", config.token)
				.expect(406)
				.then((res) => {
					expect(res.body.message).toBe('Need to be send a context');
				});
		});

		it('Quando tiver um contexto mas sem body deve retornar 406', async () => {
			await request(app)
				.post(`/uploadImage?context=usuario`)
				.set("authorization", config.token)
				.expect(406)
				.then((res) => {
					expect(res.body.message).toBe('Need to send a id to identify');
				});
		});

		it('Quando não enviar um contexto conhecido deve retornar 404', async () => {
			await request(app)
				.post(`/uploadImage?context=12345`)
				.set("authorization", config.token)
				.expect(404)
				.then((res) => {
					expect(res.body.message).toBe('This context not exists');
				});
		});

		it('Deve enviar uma imagem', async () => {
			await request(app)
				.post(`/uploadImage?context=usuario&id=123`)
				.attach('file', 'test/doge.png')
				.set("authorization", config.token)
				.expect(201)
				.then((res) => {
					expect(res.body.message).toBe('Image saved');
				});
		});

		it('Deve enviar uma imagem no contexto de usuário, passar o id e salvar o hash dela no banco', async () => {
			await request(app)
				.post(`/uploadImage?context=usuario&id=${builder.users[0].id}`)
				.attach('file', 'test/doge.png')
				.set("authorization", config.token)
				.expect(201)
				.then(async () => {
					const connection = await createConnection();
					const [[userImage]] = await connection.query('select ds_caminhoImagem from tb_usuario where cd_usuario = ?', [builder.users[0].id]);
					expect(userImage.ds_caminhoImagem).toBeTruthy();
				});
		});
	});


	describe('Reporte', () => {
		afterAll(async () => {
			await builder.reset();
			const dirs = await readdir('files/uploads/reportes')
			const dirToDeleted = dirs.filter(dirName => dirName.indexOf('test') >= 0);
			for (const dir of dirToDeleted) {
				await rmdir(`files/uploads/reportes/${dir}`, { recursive: true });
			}  		
		});
		it('Deve fazer o upload de uma prova', async () => {
			await builder.addUser();
			await builder.addReporte();
			await request(app)
				.post(`/uploadImage?context=report&id=${builder.reportes[0].cd_reporte}`)
				.set("authorization", config.token)
				.attach('file', 'test/doge.png')
				.expect(201)
				.then(async () => {
					const connection = await createConnection();
					const [[reporteImagem]] = await connection.query(
						'select ds_caminhoImagem from tb_reporte where cd_reporte = ?', 
						[builder.reportes[0].cd_reporte]
					);
					expect(reporteImagem.ds_caminhoImagem).toBeTruthy();
				});
		});
	});
});