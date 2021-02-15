import jwt from "jsonwebtoken";
import { promisify } from "util";
import { config } from "../../test/config";
import authConfig from "../config/auth";

export const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader === config.token) return next();

	if (!authHeader) {
		return res.status(401).json({ error: "Token not provided" });
	}

	const [, token] = authHeader.split(" ");

	try {
		const decoded = await promisify(jwt.verify)(token, authConfig.secret);

		req.userId = decoded;

		return next();
	} catch (error) {
		return res.status(401).json({ error: "Token invalid" });
	}
};
