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
});