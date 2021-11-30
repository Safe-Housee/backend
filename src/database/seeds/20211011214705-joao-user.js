const bcrypt = require("bcrypt");

const hashPassword = (senha) => {
	const senhaHash = bcrypt.hashSync(senha, 8);
	return senhaHash;
};
module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert("tb_usuario", [
			{
				cd_usuario: 5,
				nm_usuario: "Joao",
				ds_email: "joao@email.com",
				cd_senha: hashPassword("joao"),
				dt_nascimento: "1999-01-11",
				ds_endereco: "Rua Araguaia 100",
				cd_telefone: "13 98756282",
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("tb_usuario", null, {});
	},
};
