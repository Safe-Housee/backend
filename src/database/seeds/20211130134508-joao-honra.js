module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert("tb_honraUsuario", [
			{
				cd_usuario: 5,
				cd_honra: 5,
				dt_honra: "1999-01-11",
				qt_honra: 30,
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("tb_honraUsuario", null, {});
	},
};
