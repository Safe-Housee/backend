import * as Yup from 'yup';
import { createUser, checkEmail, returnUser } from '../services/userService';

class UserController {
  async create(req, res) {
    try {
      const userPropertys = [
        'codigo',
        'nome',
        'email',
        'senha',
        'senhaConfirmacao',
        'nascimento',
        'pais',
        'estado',
        'telefone',
      ];

      for (const property of userPropertys) {
        if (!req.body[property]) {
          return res.status(400).send({ message: `Should send ${property}` });
        }
      }

      const {
        codigo,
        nome,
        email,
        senha,
        senhaConfirmacao,
        nascimento,
        pais,
        estado,
        telefone,
      } = req.body;

      if (senha !== senhaConfirmacao) {
        return res.status(406).send({ message: 'Password is not equal' });
      }

      const isValidEmail = Yup.string().email();

      if (!(await isValidEmail.isValid(email))) {
        return res.status(406).send({ message: 'The email is not valid' });
      }

      const endereco = `${estado} - ${pais}`;

      const emailExist = await checkEmail(email);

      if (emailExist) {
        return res.status(409).send({ message: 'The email is alredy used' });
      }

      await createUser({
        codigo,
        nome,
        email,
        senha,
        nascimento,
        endereco,
        telefone,
      });

      return res.status(201).send({ message: 'Created' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  }

  async update(req, res) {
    try {
      const verificSenha = await returnUser(req.body.codigo);

      const senha01 = verificSenha.cd_senha;
      if (senha01 != req.body['senhaDeConfirmação']) {
        return res.status(403).send({ message: 'Not authorized' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
