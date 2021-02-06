'use stric';

import request from 'supertest';
import app from '../src/app';
import { user } from './userMock';
import { createConnection } from '../src/database/connection';
import { serializeData } from '../src/utils/serializeDataToMysql';

describe('UserController User', () => {

  describe('UserController Create', () => {
    it('Deve retornar 400 quando faltar uma informação no cadastro', async () => {
      const userNoInfo = {
        codigo: '01',
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
        codigo: '01',
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
  
    it('Deve retornar 201 quando o usuario for criado', async () => {

      const userValid = {
        "codigo": '01',
        "nome": "Cristian Silva",
        "email": "cristian12345@email.com",
        "senha": "batata123",
        "senhaConfirmacao": "batata123",
        "nascimento": "11/01/1999",
        "pais": "brazil",
        "estado": "SP",
        "telefone": "40028922",
      };
  
      await request(app)
      .post('/usuarios')
      .send(userValid)
      .expect(201)
      .then((res) => {
        expect(res.body.message).toBe('Created');
      });
    });
  });

  describe('UserController Update', () => {
    let resultadoInsertUsuario;

    let user = {
      "codigo": "NULL",
      "nome": "Cristian Silva",
      "email": "cristian@email.com",
      "senha": "batata123",
      "senhaConfirmacao": "batata123",
      "nascimento": "11/01/1999",
      "pais": "brazil",
      "estado": "SP",
      "telefone": "40028922",
    };
        
    beforeEach( async () => {

      const connection = await createConnection();

      user.endereco = `${user.estado} - ${user.pais}`;
      user.nascimento = serializeData(user.nascimento);
      
      /*  ResultSetHeader {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 46,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        },
        */

      let sql = `insert into tb_usuario (
              nm_usuario, 
              cd_senha, 
              cd_telefone, 
              ds_email, 
              dt_nascimento, 
              ds_endereco) 
          values (?, ?, ?, ?, ?, ?); `
      let values = [user.nome, user.senha, user.telefone, user.email, user.nascimento, user.endereco];
      const [result, buff] = await connection.execute(sql, values);

      user.codigo = result.insertId;
      connection.end()
    });
    
    afterEach( async () =>  {
      const connection = await createConnection();
      
      /*  ResultSetHeader {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 46,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        },
        */

      let resultadoDeleteUsuario = await connection.query(
        `DELETE FROM tb_usuario WHERE cd_usuario = ?;`,
        [user.codigo]
      );
      
      connection.end()
    });
    
    it('Deve retornar 403 quando a senha e a senhaDeConfirmação forem diferentes', async () => {

      let userNotAuth = {
        codigo: user.codigo,
        senhaDeConfirmação: "1235",
      };

      await request(app)
      .put('/usuarios')
      .send(userNotAuth)
      .expect(403)
      .then((res) => {
        expect(res.body.message).toBe('Not authorized')
      })

    });

  });

});
