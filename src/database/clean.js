const mysql = require("mysql2/promise");

async function clear() {
	try {
		const connection = await mysql.createConnection({
			host: "localhost",
			user: "root",
			password: "safehouse",
			database: "safehouse",
		});

		const haveUser = await connection.query("select * from tb_usuario");

		console.log("Começando limpeza no banco para os testes \n");

		if (haveUser) {
			console.log("Apagando tb_usuario");
			await connection.query("delete from tb_usuario");
		}
		const haveMatch = await connection.query("select * from tb_partida");
		if (haveMatch) {
			console.log("Apagando tb_partida");
			await connection.query("delete from tb_partida");
		}

		const haveUserMatch = await connection.query(
			"select * from tb_usuarioPartida"
		);
		if (haveUserMatch) {
			console.log("Apagando tb_usuarioPartida");
			await connection.query("delete from tb_usuarioPartida");
		}
		console.log("\n");
		console.log("Limpeza [Ok]");

		console.log("Fim da limpeza");

		process.exit(0);
	} catch (error) {
		console.log("Limpeza [Falhou]");
		console.error(error);
		process.exit(0);
	}
}

clear();
