module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.createTable("tb_honraUsuario", {
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
			cd_honra: {
				type: Sequelize.INTEGER,
				references: {
					model: "tb_honra",
					key: "cd_honra",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
				allowNull: true,
			},
			dt_honra: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			qt_honra: {
				type: Sequelize.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
		});
	},

	down: async (queryInterface) => queryInterface.dropTable("tb_honraUsuario"),
};
