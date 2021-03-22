module.exports = {
	up: async (queryInterface) => {
		await queryInterface.bulkInsert(
			"tb_honra",
			[
				{
					cd_honra: 1,
					nm_nivel: "Purgatório",
					ds_faixaDePonto: "-90",
					ds_penalidade: "Ban permanente",
					ds_imagenHonra: "purgatorio-badge",
				},
				{
					cd_honra: 2,
					nm_nivel: "Em quarentena",
					ds_faixaDePonto: "-60",
					ds_penalidade: "Ban 30",
					ds_imagenHonra: "quarentena-badge",
				},
				{
					cd_honra: 3,
					nm_nivel: "Em analise",
					ds_faixaDePonto: "-30",
					ds_penalidade: "Ban 10",
					ds_imagenHonra: "analise-badge",
				},
				{
					cd_honra: 4,
					nm_nivel: "Desconhecido",
					ds_faixaDePonto: "0",
					ds_penalidade: null,
					ds_imagenHonra: "desconhecido-badge",
				},
				{
					cd_honra: 5,
					nm_nivel: "Neutro",
					ds_faixaDePonto: "20",
					ds_penalidade: null,
					ds_imagenHonra: "neutro-badge",
				},
				{
					cd_honra: 6,
					nm_nivel: "Aspira",
					ds_faixaDePonto: "60",
					ds_penalidade: null,
					ds_imagenHonra: "aspira-badge",
				},
				{
					cd_honra: 7,
					nm_nivel: "Monge",
					ds_faixaDePonto: "120",
					ds_penalidade: null,
					ds_imagenHonra: "monge-badge",
				},
				{
					cd_honra: 8,
					nm_nivel: "Transcendente",
					ds_faixaDePonto: "200",
					ds_penalidade: null,
					ds_imagenHonra: "transcendente-badge",
				},
			],
			{}
		);
	},

	down: async (queryInterface) => {
		await queryInterface.bulkDelete("tb_honra", null, {});
	},
};
