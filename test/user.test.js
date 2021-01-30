'use stric';

import request from 'supertest';
import app from '../src/app';
import { user } from './userMock';

// const request = require('supertest');
// const app = require('../src/app');
// const { user } = require('./userMock');


  test('Deve retornar 400 quando faltar uma informação no cadastro', async () => {
    let userWhitoutEmail = user;
    delete userWhitoutEmail.email;
    await request(app)
      .post('/usuarios')
      .send(userWhitoutEmail)
      .expect(400)
      .then(res => console.log(res.body))
      
  });

