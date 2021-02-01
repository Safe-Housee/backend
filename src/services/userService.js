import bcrypt from 'bcrypt';
import { createConnection } from '../database/connection';

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
    const senhaHash = bcrypt.hashSync(senha, 10);
    const [rows] = await connection.query(
      `insert into tb_usuario (
                nm_usuario, 
                cd_senha, 
                cd_telefone, 
                ds_email, 
                dt_nascimento, 
                ds_endereco) 
                values (?, ?, ?, ?, ?, ?);`,
      [nome, senhaHash, telefone, email, nascimento, endereco]
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

    return rows.length;
  } catch (error) {
    console.error(error);
    throw new Error('Error on check email');
  }
};
