module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert("tb_honraUsuario", [
			{
				cd_usuario: 4,
				cd_honra: 6,
				dt_honra: "1999-01-11",
				qt_honra: 70,
			},
		]);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("tb_honraUsuario", null, {});
	},
};
