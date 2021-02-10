module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'tb_jogo',
      [
        {
          nm_jogo: 'Counter-Strike Global Offensive',
          ds_desenvolvedora: 'Valve Corporation, Hidden Path Entertainment',
          dt_lancamento: '2012-08-21',
          ds_categoria: 'FPS',
          ds_maxPlayers: '5 por time e 10 por partida',
          ds_faixaEtaria: 17,
        },
        {
          nm_jogo: 'League of Legends',
          ds_desenvolvedora: 'Riot Games',
          dt_lancamento: '2009-10-27',
          ds_categoria: 'Moba',
          ds_maxPlayers: '5 por time e 10 por partida',
          ds_faixaEtaria: 12,
        },
        {
          nm_jogo: 'Tekken 7',
          ds_desenvolvedora: 'Namco Entertainment',
          dt_lancamento: '2015-03-18',
          ds_categoria: 'Luta',
          ds_maxPlayers: '1 por time e 2 por partida',
          ds_faixaEtaria: 12,
        },
      ],
      {}
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tb_jogo', null, {});
  },
};
