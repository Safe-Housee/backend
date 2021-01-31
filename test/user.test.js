'use stric';

import request from 'supertest';
import app from '../src/app';
import { user } from './userMock';

describe('UserController Tests', () => {
  it('Deve retornar 400 quando faltar uma informação no cadastro', async () => {
    const userNoInfo = {
      nome: 'Cristian Silva',
      senha: 'batata123',
      senhaConfirmacao: 'batata123',
      nascimento: '11/01/1999',
      pais: 'brazil',
      estado: 'SP',
      telefone: '40028922',
    };
    await request(app)
      .post('/usuarios')
      .send(userNoInfo)
      .expect(400)
      .then((res) => {
        expect(res.body.message).toBe('Should send email');
      });
  });

  it('Deve retornar 406 quando as senhas forem diferentes', async () => {
    let userWhitDifferentPass = user;
    userWhitDifferentPass.senha = 'joaozinho';
    userWhitDifferentPass.email = 'cristian@email.com';
    await request(app)
      .post('/usuarios')
      .send(userWhitDifferentPass)
      .expect(406)
      .then((res) => {
        expect(res.body.message).toBe('Password is not equal');
      });
  });

  it('Se o email for invalido deve retornar 406', async () => {
    const userInvalidEmail = {
      nome: 'Cristian Silva',
      email: 'cristian12345.com',
      senha: 'batata123',
      senhaConfirmacao: 'batata123',
      nascimento: '11/01/1999',
      pais: 'brazil',
      estado: 'SP',
      telefone: '40028922',
    };

    await request(app)
      .post('/usuarios')
      .send(userInvalidEmail)
      .expect(406)
      .then((res) => {
        expect(res.body.message).toBe('The email is not valid');
      });
  });
});
