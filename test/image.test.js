'use stric';

import request from 'supertest';
import { rm, readdir } from "fs/promises";
import app from '../src/app';
import TestBuilder from "../src/testBuilder/testeBuilder";
import { config } from "./config";
import { createConnection } from '../src/database/connection';

describe("Upload de imagem", () => {
	let mockData = null;
	beforeEach(async () => {
		mockData = new TestBuilder();
		await mockData.addUser('imageUser');
	});
	afterAll(async () => {
		await mockData.reset();
		const files = await readdir('tmp/uploads/')
		const filesToDeleted = files.filter(filename => filename.indexOf('test') >= 0);
		for (const file of filesToDeleted) {
			await rm(`tmp/uploads/${file}`);
		}  		
	});

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
			.post(`/uploadImage?context=usuario&id=${mockData.users[0].id}`)
			.attach('file', 'test/doge.png')
			.set("authorization", config.token)
			.expect(201)
			.then(async () => {
				const connection = await createConnection();
                const [[userImage]] = await connection.query('select ds_caminhoImagem from tb_usuario where cd_usuario = ?', [mockData.users[0].id]);
				expect(userImage.ds_caminhoImagem).toBeTruthy();
			});
	});
});