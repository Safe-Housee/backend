

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('tb_usuario', {
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
      ds_endereco:{
        type: Sequelize.STRING,
        allowNull: false
      },
      cd_telefone: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }); 
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tb_usuario');

  }
};
