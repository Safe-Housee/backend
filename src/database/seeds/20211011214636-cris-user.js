const bcrypt = require("bcrypt");

const hashPassword = (senha) => {
	const senhaHash = bcrypt.hashSync(senha, 8);
	return senhaHash;
};
module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert("tb_usuario", [
			{
				nm_usuario: "Tucker",
				ds_email: "cristian123105@gmail.com",
				cd_senha: hashPassword("136crcc12"),
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
