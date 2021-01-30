class UserController {
  create(req, res) {
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
    return res.json('1000');
  }
}

export default new UserController();
