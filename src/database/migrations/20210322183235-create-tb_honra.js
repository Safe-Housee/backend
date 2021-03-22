module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.createTable("tb_honra", {
			cd_honra: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			nm_nivel: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_faixaDePonto: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_penalidade: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_imagenHonra: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface) => queryInterface.dropTable("tb_honra"),
};
