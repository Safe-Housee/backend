const bcrypt = require("bcrypt");

const hashPassword = (senha) => {
	const senhaHash = bcrypt.hashSync(senha, 8);
	return senhaHash;
};
const generateConvertedData = () => {
	const date = new Date();
	let month = date.getMonth() + 1;
	if (month < 10) {
		month = `0${month}`;
	}
	return `${date.getFullYear()}-${month}-${date.getDate()}`;
};

module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert("tb_usuario", [
			{
				cd_usuario: 1,
				nm_usuario: "Tucker",
				ds_email: "cristian123105@gmail.com",
				cd_senha: hashPassword("136crcc12"),
				dt_nascimento: generateConvertedData(),
				ds_endereco: "Rua Araguaia 100",
				cd_telefone: "13 98756282",
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("tb_usuario", null, {});
	},
};
