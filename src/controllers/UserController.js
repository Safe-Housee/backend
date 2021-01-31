import * as Yup from 'yup';

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
        // nome,
        email,
        senha,
        senhaConfirmacao,
        // nascimento,
        // pais,
        // estado,
        // telefone,
      } = req.body;

      if (senha !== senhaConfirmacao) {
        return res.status(406).send({ message: 'Password is not equal' });
      }

      const isValidEmail = Yup.string().email();

      if (!(await isValidEmail.isValid(email))) {
        return res.status(406).send({ message: 'The email is not valid' });
      }

      // const endereco = ` ${estado} - ${pais}`;

      // if (emailExist) {
      //   return res.status(409).send({ message: 'The email is alredy used' });
      // }

      return res.status(201).send({ message: 'Created' });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
