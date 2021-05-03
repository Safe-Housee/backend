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
        await mockData.addUser(); //Remover honra
        await mockData.addMatch(undefined, 2);
        await mockData.addMatchUser();
        await mockData.addMatchUser(mockData.users[0].id, undefined, false);
        await mockData.addHonraUsuario(undefined, undefined, 199);
        await mockData.addHonraUsuario(mockData.users[1].id, undefined, 199);
        
    });

    afterAll(async () => {
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

    it('Deve adicionar uma avaliação positiva', async () => {
        await request(app)
            .post(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[0].id}`)
            .set("authorization", config.token)
            .send({ avaliacao: 'positiva' })
            .expect(200)
            .then(res => {
                expect(res.body.nm_nivel).toBe('Transcendente');
                expect(res.body.qt_honra).toBe(200);
            });
    });

    it('Deve adicionar uma avaliação negativa', async () => {
        await request(app)
            .post(`/partidas/${mockData.matches[0].id}/usuario/${mockData.users[1].id}`)
            .set("authorization", config.token)
            .send({ avaliacao: 'negativa' })
            .expect(200)
            .then(res => {
                expect(res.body.nm_nivel).toBe('Monge');
                expect(res.body.qt_honra).toBe(198);
            });
    });
});