'use stric';

import request from 'supertest';
import app from '../src/app';

import { createConnection } from '../src/database/connection';
import { hashPassword, serializeData } from '../src/utils';
import iconv from 'iconv-lite';
import encodings from 'iconv-lite/encodings';
iconv.encodings = encodings;

describe('LoginController Tests', () => {
    let connection = null;
    const user = {
        "nome": "Cristian Silva",
        "email": `cristian@email.com`,
        "senha": "batata123",
        "senhaConfirmacao": "batata123",
        "nascimento": "11/01/1999",
        "pais": "brazil",
        "estado": "SP",
        "telefone": "40028922",
    };
    beforeEach(async () => {
        connection = await createConnection();
        
        user.endereco = `${user.estado} - ${user.pais}`;
        user.nascimento = serializeData(user.nascimento);
        user.senhaHash = hashPassword(user.senha);

        const sql = `insert into tb_usuario (
                nm_usuario, 
                cd_senha, 
                cd_telefone, 
                ds_email, 
                dt_nascimento, 
                ds_endereco) 
            values (?, ?, ?, ?, ?, ?);`;
        const values = [user.nome, user.senhaHash, user.telefone, user.email, user.nascimento, user.endereco];

        const [rows] = await connection.query(sql, values);
        user.codigo = rows.insertId;
    });

    afterEach(async () => {
        await connection.execute('DELETE FROM tb_usuario WHERE cd_usuario = ?', [user.codigo]);
    });

    it('Deve retornar 406 quando faltar uma informação', async (done) => {
        const user = {
            email: "cristian@email.com",
        };
        await request(app)
            .post('/login')
            .send(user)
            .expect(406)
            .then((res) => {
                expect(res.body.message).toBe('The request body is not valid, check the params');
            });
            done();
    });

    it('Deve retornar 404 quando o usuario não for encontrado', async (done) => {
        const user = {
            email: "cristian123@email.com",
            senha: "batata123"
        };
        await request(app)
            .post('/login')
            .send(user)
            .expect(404)
            .then((res) => {
                expect(res.body.message).toBe('User not found');
            });
            done();
    });

    it('Quando a senha não for a mesma da salva deve retornar 400', async (done) => {
        const user = {
            email: "cristian@email.com",
            senha: "batata3"
        };
        await request(app)
            .post('/login')
            .send(user)
            .expect(400)
            .then((res) => {
                expect(res.body.message).toBe('Password dont match');
            });
            done();
    });

    it('Deve retornar um token quando tudo estiver certo', async (done) => {
        const user = {
            "email": "cristian@email.com",
            "senha": "batata123"
        };
        await request(app)
            .post('/login')
            .send(user)
            .expect(200)
            .then((res) => {
                expect(res.body.token).toBeTruthy();
                expect(res.body.cdUsuario).toBeTruthy();
            });
            done();
    });

    it('Deve retornar uma mensagem caso o usuário que esteja tentando logar esteja bloqueado', async () => {
        const userMiddleware = {
            "nome": "Cristian Silva",
            "email": `cristian123@email.com`,
            "senha": "batata123",
            "senhaConfirmacao": "batata123",
            "nascimento": "11/01/1999",
            "pais": "brazil",
            "estado": "SP",
            "telefone": "40028922",
        };
        connection = await createConnection();
        
        userMiddleware.endereco = `${userMiddleware.estado} - ${userMiddleware.pais}`;
        userMiddleware.nascimento = serializeData(userMiddleware.nascimento);
        userMiddleware.senhaHash = hashPassword(userMiddleware.senha);

        const sql = `insert into tb_usuario (
                nm_usuario, 
                cd_senha, 
                cd_telefone, 
                ds_email, 
                dt_nascimento, 
                ds_endereco,
                ic_bloqueado) 
            values (?, ?, ?, ?, ?, ?, 1);`;
        const values = [
            userMiddleware.nome, 
            userMiddleware.senhaHash, 
            userMiddleware.telefone, 
            userMiddleware.email, 
            userMiddleware.nascimento, 
            userMiddleware.endereco
        ];

        const [rows] = await connection.query(sql, values);
        userMiddleware.codigo = rows.insertId;
        const userToSend = {
            "email": userMiddleware.email,
            "senha": userMiddleware.senha
        };
        const response = await request(app).post("/login").send(userToSend);
        await request(app)
            .get('/partidas')
            .set("authorization", response.body.token)
            .expect(401)
            .then(async (res) => {
                expect(res.body.message).toBe('Você está bloqueado, espere até que seje desbloqueado');
                await connection.execute('DELETE FROM tb_usuario WHERE cd_usuario = ?', [userMiddleware.codigo]);
            });
    })
});