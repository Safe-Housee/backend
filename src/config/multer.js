import multer from "multer";
import crypto from "crypto";
import { extname, resolve } from "path";
import { contextDestinations } from "../enum/contextDestination";

export default {
	storage: multer.diskStorage({
		destination: (req, _, cb) => {
			const { context } = req.query;
			return cb(
				null,
				resolve(
					__dirname,
					"..",
					"..",
					"tmp",
					"uploads",
					contextDestinations[context]
				)
			);
		},

		filename: (req, file, cb) => {
			console.log(JSON.stringify(String(cb)));
			crypto.randomBytes(16, (err, res) => {
				if (err) return cb(err);

				return cb(
					null,
					`${process.env.NODE_ENV}-${req.query.context}-${res.toString(
						"hex"
					)}${extname(file.originalname)}`
				);
			});
		},
	}),
};
