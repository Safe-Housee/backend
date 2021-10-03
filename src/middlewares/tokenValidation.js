import jwt from "jsonwebtoken";
import { promisify } from "util";
import { config } from "../../test/config";
import authConfig from "../config/auth";

export const auth = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (authHeader === config.token) {
		const decoded = await promisify(jwt.verify)(authHeader, authConfig.secret);

		req.userId = decoded;
		return next();
	}

	if (!authHeader) {
		return res.status(401).json({ error: "Token not provided" });
	}

	try {
		const decoded = await promisify(jwt.verify)(authHeader, authConfig.secret);

		req.userId = decoded;

		return next();
	} catch (error) {
		console.error(error);
		return res.status(401).json({ error: "Token invalid" });
	}
};
