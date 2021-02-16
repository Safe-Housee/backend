import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import {
  createUser,
  checkEmail,
  returnUser,
  updateUser,
} from '../services/userService';
import { checkPassword, hashPassword } from '../utils';

class UserController {
	async create(req, res) {
		try {
			const userPropertys = [
				"nome",
				"email",
				"senha",
				"senhaConfirmacao",
				"nascimento",
				"pais",
				"estado",
				"telefone",
			];

			for (const property of userPropertys) {
				if (!req.body[property]) {
					return res.status(400).send({ message: `Should send ${property}` });
				}
			}

			const {
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
				return res.status(406).send({ message: "Password is not equal" });
			}

			const isValidEmail = Yup.string().email();

			if (!(await isValidEmail.isValid(email))) {
				return res.status(406).send({ message: "The email is not valid" });
			}

			const endereco = `${estado} - ${pais}`;

			const emailExist = await checkEmail(email);

			if (emailExist) {
				return res.status(409).send({ message: "The email is alredy used" });
			}

			await createUser({
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
      if (req.body.ds_email) {
        const emailExist = await checkEmail(req.body.ds_email);
        if (emailExist) {
          return res.status(400).send({ message: 'Email exist' });
        }
      }

      if (req.body.cd_senha != null) {
        const user = await returnUser(req.body.cd_usuario);
        const senhaBD = user[0].cd_senha;

        const compara = await checkPassword(req.body.cd_senha, senhaBD);

        if (compara) {
          for (const prop of Object.keys(user[0])) {
            if (req.body[prop]) {
              user[0][prop] = req.body[prop];
              if (prop === 'cd_senha' && req.body[prop]) {
                user[0][prop] = hashPassword(req.body[prop]);
              }
            }
          }

          const result = await updateUser(user);

          if (result.changedRows === 1) {
            return res.status(201).send({ message: 'Update' });
          }

          return res.status(401).send({ message: 'Erro ao atualizar' });
        }

        return res.status(403).send({ message: 'Not authorized' });
      }

      return res
        .status(400)
        .send({ message: 'Should send password confirmation' });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
