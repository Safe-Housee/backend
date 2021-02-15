'use stric';

import request from 'supertest';
import app from '../src/app';
import { config } from './config';

describe('MatchController Tests', () => {
  it('Deve retornar 400 quando faltar uma informação no cadastro', async () => {
    const matchInfo = {
        "cd_jogo": 1,
        "nm_partida": "Só os mlk bom",
        "dt_partida" : "12-02-2021",
    }
    await request(app)
      .post('/partidas')
      .set('authorization', config.token)
      .send(matchInfo)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Should send Hora da partida');
      });
  });

});
