module.exports = {
	up: async (queryInterface, Sequelize) =>
		queryInterface.createTable("tb_reporte", {
			cd_reporte: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			cd_reportado: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: false,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
			},
			cd_avaliador: {
				type: Sequelize.INTEGER,
				allowNull: false,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
			},
			cd_reportador: {
				type: Sequelize.INTEGER,
				allowNull: false,
				unique: false,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
			},
			ds_caminhoImagem: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			ds_statusReporte: {
				type: Sequelize.STRING,
				allowNull: false,
			},

			ds_reporte: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			dt_reporte: {
				type: Sequelize.DATE,
				allowNull: false,
			},
		}),

	down: async (queryInterface) => queryInterface.dropTable("tb_reporte"),
};
