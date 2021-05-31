'use stric';

import bcrypt from 'bcrypt';
import request from 'supertest';
import { rm, readdir } from "fs/promises";
import app from '../src/app';
import { createConnection } from '../src/database/connection';
import { serializeData } from '../src/utils/serializeDataToMysql';
import { config } from './config';
import TestBuilder from '../src/testBuilder/testeBuilder';

describe('UserController User', () => {
  const builder = new TestBuilder();

  afterEach(async () => {
    await builder.reset();
  });

  describe('UserController Create', () => {
    it('Deve retornar 400 quando faltar uma informação no cadastro', async () => {
      const userNoInfo = {
        nome: 'Tucks',
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
      let userWhitDifferentPass = {
        nome: 'Cristuker',
        senha: 'joaozinho',
        senhaConfirmacao: 'batata123',
        nascimento: '11/01/1999',
        pais: 'brazil',
        estado: 'SP',
        telefone: '40028922',
        email: 'cristian@email.com',
      };

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
        nome: 'vitorcrl',
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

    it('Deve retornar 409 se o nome de usuário já existir', async () => {
      const userValid = {
        "nome": "xxxCrisXXX",
        "email": "cristian12345@email.com",
        "senha": "batata123",
        "senhaConfirmacao": "batata123",
        "nascimento": "11/01/1999",
        "pais": "brazil",
        "estado": "SP",
        "telefone": "40028922",
      };
      await builder.addUser(userValid.nome);

      await request(app)
        .post('/usuarios')
        .send(userValid)
        .expect(409)
        .then((res) => {
          expect(res.body.message).toBe('This user name is already in use');
        });
    });

    it('Deve retornar 201 quando o usuario for criado', async () => {

      const userValid = {
        "nome": "xxxCrisXXX",
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
          expect(res.body.user.nm_usuario).toBe(userValid.nome);
          expect(res.body.user.ds_email).toBe(userValid.email);
          expect(res.body.user.nm_nivel).toBe('Desconhecido');
        });
    });
  });

  describe('UserController Update', () => {

    let user = {
      "codigo": "NULL",
      "nome": "kng",
      "email": "cristian1@email.com",
      "senha": "1234",
      "senhaDeConfirmacao": "NULL",
      "nascimento": "11/01/1999",
      "pais": "brazil",
      "estado": "SP",
      "telefone": "40028922",
    };

    beforeEach(async () => {

      const connection = await createConnection();

      user.senha = bcrypt.hashSync(user.senha, 10);
      user.endereco = `${user.estado} - ${user.pais}`;
      user.nascimento = serializeData(user.nascimento);


      let sql = `insert into tb_usuario (
              nm_usuario, 
              cd_senha, 
              cd_telefone, 
              ds_email, 
              dt_nascimento, 
              ds_endereco) 
          values (?, ?, ?, ?, ?, ?); `
      let values = [user.nome, user.senha, user.telefone, user.email, user.nascimento, user.endereco];
      const [result] = await connection.execute(sql, values);

      user.codigo = result.insertId;
      await connection.end()
    });

    afterEach(async () => {
      const connection = await createConnection();

      await connection.query(
        `DELETE FROM tb_usuario WHERE cd_usuario = ?;`,
        [user.codigo]
      );

      connection.end()
    });

    it('Deve retornar 201 quando tudo ocorrer na normalidade', async () => {

      let newUser = {
        cd_usuario: user.codigo,
        nm_usuario: "v$m",
        ds_email: "teste@email.com",
        cd_senha: "1234",
      }

      await request(app)
        .put('/usuarios')
        .set('authorization', config.token)
        .send(newUser)
        .expect(201)
        .then((res) => {
          expect(res.body.message).toBe('Update')
        })
    });

    it('Deve retornar 403 quando a senha e a senhaDeConfirmação forem diferentes', async () => {

      let userNotAuth = {
        cd_usuario: user.codigo,
        cd_senha: "1234",
      };

      await request(app)
        .put('/usuarios')
        .set('authorization', config.token)
        .send(userNotAuth)
        .expect(403)
        .then((res) => {
          expect(res.body.message).toBe('Not authorized')
        })

    });

    it('Deve retornar 400 quando não for enviado a senha de confirmação', async () => {

      let userPasswVoid = {
        cd_usuario: user.codigo,
        cd_senna: null,
      };

      await request(app)
        .put('/usuarios')
        .set('authorization', config.token)
        .send(userPasswVoid)
        .expect(400)
        .then((res) => {
          expect(res.body.message).toBe('Should send password confirmation')
        })
    });

  });

  describe('UserController index', () => {
    beforeEach(async () => {
      await builder.addUser();
      await request(app)
      .post(`/uploadImage?context=usuario&id=${builder.users[0].cd_usuario}`)
      .set("authorization", config.token)
      .attach('file', 'test/cat.png')
    });

    afterAll(async () => {
      await builder.reset();
      const files = await readdir('tmp/uploads/perfil')
      const filesToDeleted = files.filter(filename => filename.indexOf('test') >= 0);
      for (const file of filesToDeleted) {
        await rm(`tmp/uploads/perfil/${file}`);
      }  	
    });

    it('Deve retornar o id do usuário pelo id dele', async () => {
      await request(app)
        .get(`/usuarios/${builder.users[0].id}`)
        .set('authorization', config.token)
        .expect(200)
        .then((res) => {
          expect(res.body.cd_usuario).toBe(builder.users[0].id);
          expect(res.body.profileImage).toBeTruthy();
        })
    });
  });

});
