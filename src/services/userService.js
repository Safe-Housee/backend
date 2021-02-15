import bcrypt from 'bcrypt';
import auth from '../config/auth';
import { createConnection } from '../database/connection';
import { serializeData } from '../utils/serializeDataToMysql';

export const createUser = async ({
  nome,
  email,
  senha,
  nascimento,
  endereco,
  telefone,
}) => {
  try {
    const connection = await createConnection();
    const senhaHash = bcrypt.hashSync(senha, auth.salt);
    const novaData = serializeData(nascimento);
    const [rows] = await connection.query(
      `insert into tb_usuario (
            nm_usuario, 
            cd_senha, 
            cd_telefone, 
            ds_email, 
            dt_nascimento, 
            ds_endereco) 
        values (?, ?, ?, ?, ?, ?);`,
      [nome, senhaHash, telefone, email, novaData, endereco]
    );
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('Error on insert in tb_usuario');
  }
};

export const checkEmail = async (email) => {
  try {
    const connection = await createConnection();
    const [
      rows,
    ] = await connection.query(
      `select * from tb_usuario tu where tu.ds_email = ?`,
      [email]
    );
    await connection.end();
    return rows.length;
  } catch (error) {
    console.error(error);
    throw new Error('Error on check email');
  }
};

export const returnUser = async (codigoUser) => {
  try {
    const connection = await createConnection();

    const sql = `SELECT * FROM tb_usuario WHERE cd_usuario = ?`;
    const values = [codigoUser];
    const [result, buff] = await connection.execute(sql, values);

    connection.end();

    return result;
  } catch (error) {
    console.error(error);
    throw new Error('Erro ao pesquisar usuario');
  }
};

export const getUser = async (email) => {
  try {
    const connection = await createConnection();
    const [
      rows,
    ] = await connection.query(
      `select * from tb_usuario tu where tu.ds_email = ?`,
      [email]
    );
    await connection.end();
    return rows;
  } catch (error) {
    console.error(error);
    throw new Error('Error on check email');
  }
};
