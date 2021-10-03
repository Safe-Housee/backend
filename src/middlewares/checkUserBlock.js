import { createConnection } from "../database/connection";

export const checkUserBlock = async (req, res, next) => {
	try {
		const cdUsuario = req.userId;
		const connection = await createConnection();
		const [[icBlock]] = await connection.execute(
			`
		SELECT ic_bloqueado
		FROM tb_usuario
		WHERE cd_usuario = ?`,
			[cdUsuario]
		);
		await connection.end();
		if (icBlock?.ic_bloqueado === 1) {
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
