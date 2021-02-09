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
        "email": "cristian12345@email.com",
        "email": "cristian@email.com",
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
        user.senha = hashPassword(user.senha);

        const sql = `insert into tb_usuario (
                nm_usuario, 
                cd_senha, 
                cd_telefone, 
                ds_email, 
                dt_nascimento, 
                ds_endereco) 
            values (?, ?, ?, ?, ?, ?);`;
        const values = [user.nome, user.senha, user.telefone, user.email, user.nascimento, user.endereco];

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
});