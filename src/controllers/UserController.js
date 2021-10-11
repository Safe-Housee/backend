import * as Yup from "yup";
import {
	createUser,
	checkEmail,
	returnUser,
	updateUser,
	checkUser,
	returnOneUser,
	changeBlockStatus,
	blockUserTemp,
} from "../services/userService";
import { checkPassword, hashPassword } from "../utils";

class UserController {
	async create(req, res) {
		try {
			const userPropertys = [
				"ds_email",
				"ds_emailConfirmation",
				"cd_telefone",
				"nm_usuario",
				"cd_senha",
				"dt_nascimento",
				"cd_senhaConfirmation",
			];

			for (const property of userPropertys) {
				if (!req.body[property]) {
					return res.status(400).send({ message: `Should send ${property}` });
				}
			}

			const {
				nm_usuario: nome,
				ds_email: email,
				cd_senha: senha,
				cd_senhaConfirmation: senhaConfirmacao,
				dt_nascimento: nascimento,
				pais = "",
				estado = "",
				cd_telefone: telefone,
			} = req.body;

			if (senha !== senhaConfirmacao) {
				return res.status(406).send({ message: "Password is not equal" });
			}

			const isValidEmail = Yup.string().email();

			if (!(await isValidEmail.isValid(email))) {
				return res.status(406).send({ message: "The email is not valid" });
			}

			const emailExist = await checkEmail(email);

			if (emailExist) {
				return res.status(409).send({ message: "The email is alredy used" });
			}

			const userExists = await checkUser(nome);

			if (userExists) {
				return res
					.status(409)
					.send({ message: "This user name is already in use" });
			}

			const endereco = `${estado} - ${pais}`;

			const user = await createUser({
				nome,
				email,
				senha,
				nascimento,
				endereco,
				telefone,
			});
			return res.status(201).send({ message: "Created", user });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async update(req, res) {
		try {
			if (req.body.ds_email) {
				const emailExist = await checkEmail(req.body.ds_email);
				if (emailExist) {
					return res.status(400).send({ message: "Email exist" });
				}
			}

			if (req.body.cd_senha != null) {
				const user = await returnUser(req.body.cd_usuario);
				const senhaBD = user[0].cd_senha;

				const compara = await checkPassword(req.body.cd_senha, senhaBD);

				if (compara) {
					for (const prop of Object.keys(user[0])) {
						if (req.body[prop]) {
							user[0][prop] = req.body[prop];
							if (prop === "cd_senha" && req.body[prop]) {
								user[0][prop] = hashPassword(req.body[prop]);
							}
						}
					}

					const result = await updateUser(user);

					if (result.changedRows === 1) {
						return res.status(201).send({ message: "Update" });
					}

					return res.status(401).send({ message: "Erro ao atualizar" });
				}

				return res.status(403).send({ message: "Not authorized" });
			}

			return res
				.status(400)
				.send({ message: "Should send password confirmation" });
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async index(req, res) {
		try {
			const { usuarioId } = req.params;

			const usuario = await returnOneUser(usuarioId);
			return res.status(200).send(usuario);
		} catch (error) {
			console.error(error);
			return res.status(500).send({ message: "Internal server error" });
		}
	}

	async block(req, res) {
		try {
			const { cdUsuario } = req.params;
			const { blockDate } = req.body;
			const [user] = await returnUser(cdUsuario);
			if (blockDate) {
				await blockUserTemp(cdUsuario, blockDate);
			} else {
				const newBlockIndicator = !user.ic_bloqueado;
				await changeBlockStatus(cdUsuario, newBlockIndicator);
			}
			return res.status(200).send();
		} catch (error) {
			console.error(error);
			return res.status(500).send("Internal server error");
		}
	}
}

export default new UserController();
