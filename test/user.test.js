'use stric';

import request from 'supertest';
import app from '../src/app';
import { user } from './userMock';


describe('UserController Tests', () => {
  it('Deve retornar 400 quando faltar uma informação no cadastro', async () => {
    let userWhitoutEmail = user;
    delete userWhitoutEmail.email;
    await request(app)
      .post('/usuarios')
      .send(userWhitoutEmail)
      .expect(400)
      .then(res => {
        expect(res.body.message).toBe('Should send email');
      })
      
  });

  it('Deve retornar 406 quando as senhas forem diferentes', async () => {
    let userWhitDifferentPass = user;
    userWhitDifferentPass.senha = 'joaozinho';
    await request(app)
      .post('/usuarios')
      .send(userWhitDifferentPass)
      .expect(406)
      .then(res => {
        expect(res.body.message).toBe('Password is not equal');
      })
  });
});


