module.exports = {
	up: async (queryInterface, Sequelize) =>
		queryInterface.createTable("tb_partida", {
			cd_partida: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			cd_jogo: {
				type: Sequelize.INTEGER,
				references: {
					model: "tb_jogo",
					key: "cd_jogo",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
				allowNull: true,
			},
			nm_partida: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			dt_partida: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			hr_partida: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		}),

	down: async (queryInterface) => queryInterface.dropTable("tb_partida"),
};
