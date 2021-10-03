module.exports = {
	up: async (queryInterface, Sequelize) =>
		queryInterface.createTable("tb_usuario", {
			cd_usuario: {
				type: Sequelize.INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
			},
			nm_usuario: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			cd_senha: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			dt_nascimento: {
				type: Sequelize.DATE,
				allowNull: false,
			},
			ds_endereco: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			cd_telefone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			ds_caminhoImagem: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			ic_bloqueado: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
		}),

	down: async (queryInterface) => queryInterface.dropTable("tb_usuario"),
};
