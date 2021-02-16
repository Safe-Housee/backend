module.exports = {
	up: async (queryInterface, Sequelize) =>
		queryInterface.createTable("tb_usuarioPartida", {
			cd_usuario: {
				type: Sequelize.INTEGER,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
				allowNull: true,
			},
			cd_partida: {
				type: Sequelize.INTEGER,
				references: {
					model: "tb_partida",
					key: "cd_partida",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
				allowNull: true,
			},
			cd_criador: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
		}),
	down: async (queryInterface) => queryInterface.dropTable("tb_usuarioPartida"),
};
