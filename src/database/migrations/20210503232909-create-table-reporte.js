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
				allowNull: true,
				unique: false,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			cd_reportador: {
				type: Sequelize.INTEGER,
				allowNull: true,
				unique: false,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			cd_avaliador: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: "tb_usuario",
					key: "cd_usuario",
				},
				onUpdate: "CASCADE",
				onDelete: "SET NULL",
			},
			ds_caminhoImagem: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			ds_statusReporte: {
				type: Sequelize.STRING,
				allowNull: false,
				defaultValue: "pendente",
			},
			ds_reporte: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			dt_reporte: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			nm_pastaArquivos: {
				type: Sequelize.STRING,
				allowNull: true,
			},
		}),

	down: async (queryInterface) => queryInterface.dropTable("tb_reporte"),
};
