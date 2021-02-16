import * as Yup from "yup";
import jwt from "jsonwebtoken";
import authConfig from "../config/auth";
import { getUser } from "../services/userService";
import { checkPassword } from "../utils/index";

class Login {
	async store(request, response) {
		try {
			const schema = Yup.object({
				email: Yup.string().required(),
				senha: Yup.string().required(),
			});

			if (!(await schema.isValid(request.body))) {
				return response
					.status(406)
					.send({ message: "The request body is not valid, check the params" });
			}

      const { email, senha } = request.body;
      const [user] = await getUser(email);

			if (!user) {
				return response.status(404).send({ message: "User not found" });
			}
			const isOkPassaword = await checkPassword(senha, user.cd_senha);
			if (!isOkPassaword) {
				return response.status(400).send({ message: "Password dont match" });
			}

			const token = jwt.sign(user.cd_usuario, authConfig.secret);

			return response.status(200).send({ token });
		} catch (error) {
			console.error(error);
			return response.status(500).send({ message: "Internal server error" });
		}
	}
}

export default new Login();
