import { createConnection } from "../database/connection";

export const checkUserBlock = async (req, res, next) => {
	try {
		const cdUsuario = req.userId;
		const connection = await createConnection();
		const [[userBlockInfo]] = await connection.execute(
			`
			SELECT 
				ic_bloqueado,
				dt_desbloqueio
			FROM tb_usuario
			WHERE cd_usuario = ?`,
			[cdUsuario]
		);
		await connection.end();
		const actualDate = new Date().getTime();
		if (userBlockInfo?.dt_desbloqueio) {
			if (actualDate < userBlockInfo?.dt_desbloqueio) {
				return res.status(401).send({
					message: "Usuário bloqueado temporariamente",
				});
			}
		}

		if (userBlockInfo?.ic_bloqueado === 1) {
			return res.status(401).send({
				message: "Você está bloqueado, espere até que seje desbloqueado",
			});
		}
		return next();
	} catch (error) {
		console.error(error);
		return res.status(500).send("Error ao verificar o status do usuário");
	}
};
