module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert("tb_honraUsuario", [
			{
				cd_usuario: 1,
				cd_honra: 7,
				dt_honra: "1999-01-11",
				qt_honra: 150,
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("tb_honraUsuario", null, {});
	},
};
