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
});


