'use stric';

import request from 'supertest';
import app from '../src/app';
import TestBuilder from "../src/testBuilder/testeBuilder";
import { config } from "./config";


describe("Upload de imagem", () => {
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
			.expect(200)
			.then((res) => {
                expect(res.body.message).toBe('Image saved');
			});
	});
});