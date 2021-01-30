class UserController {
  create(req, res) {
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
      /* eslint-disable consistent-return */
      userPropertys.forEach((property) => {
        /* eslint-disable consistent-return */
        if (!req.body[property]) {
          return res.status(400).json({ message: `Should send ${property}` });
        }
      });

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
        return res.status(406).json({ message: 'Password is not equal' });
      }

      return res.status(201).json({ message: '1000' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new UserController();
