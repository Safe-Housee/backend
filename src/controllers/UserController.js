import * as Yup from 'yup';
import bcrypt from 'bcrypt';
import { util } from 'prettier';
import { createUser, checkEmail, returnUser } from '../services/userService';
import { utils } from '../utils';

class UserController {
  async create(req, res) {
    try {
      const userPropertys = [
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
      if (req.body.senhaDeConfirmacao != null) {
        const user = await returnUser(req.body.codigo);
        const senhaBD = user[0].cd_senha;

        const compara = utils.passwordHash.checkPassword(
          req.body.senhaDeConfirmacao,
          senhaBD
        );
        /* const compara = bcrypt.compareSync(
          req.body.senhaDeConfirmacao,
          senhaBD
        ); */

        if (compara) {
          return res.status(201).send({ message: 'Update' });
          /*
          let i = 0;
          while(i <= user.length)
          {
            if(req.body == user[0])
            {
              console.log(req.body)
            }
            i++;
          }
          const isValidEmail = Yup.string().email();
          if (!(await isValidEmail.isValid(email))) {
            return res.status(406).send({ message: 'The email is not valid' });
          }
    
          const emailExist = await checkEmail(email);
          if (emailExist) {
            return res.status(409).send({ message: 'The email is alredy used' });
          }
          */
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
