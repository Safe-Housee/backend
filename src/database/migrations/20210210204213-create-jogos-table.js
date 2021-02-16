module.exports = {
	up: async (queryInterface, Sequelize) => {
		queryInterface.createTable("tb_jogo", {
			cd_jogo: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			nm_jogo: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_desenvolvedora: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			dt_lancamento: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			ds_categoria: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_maxPlayers: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_faixaEtaria: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface) => queryInterface.dropTable("tb_jogo"),
};
