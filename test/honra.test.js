'use stric';

import request from 'supertest';
import app from '../src/app';
import TestBuilder from "../src/testBuilder/testeBuilder";
import { config } from "./config";

fdescribe('Honra - Testes', () => {
    let mockData = null;
    beforeEach(async () => {
        mockData = new TestBuilder();
        await mockData.addUser();
        await mockData.addMatch(undefined, 2);
        await mockData.addHonraUsuario();
        await mockData.addMatchUser();
    });

    afterAll(async () =>{
        await mockData.reset();
    });

    it('Deve retornar 400 quando faltar informação', async () => {
        await request(app)
            .post(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[0].id}`)
            .set("authorization", config.token)
            .send({})
            .expect(400)
            .then(res => {
                expect(res.body.message).toBe('Need to be send avaliacao');
            });
    });

    it('Deve retornar 403 quando a avalição não for string', async () => {
        await request(app)
            .post(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[0].id}`)
            .set("authorization", config.token)
            .send({ avaliacao: 1 })
            .expect(403)
            .then(res => {
                expect(res.body.message).toBe('Avalicao need to be a string');
            });
    });
});