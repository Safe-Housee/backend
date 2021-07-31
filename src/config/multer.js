import multer from "multer";
import crypto from "crypto";
import fs from "fs";
import { extname, resolve } from "path";
import { contextDestinations } from "../enum/contextDestination";
import { getReporteInfo } from "../services/reporteService";

export default {
	storage: multer.diskStorage({
		destination: async (req, _, cb) => {
			try {
				let destination = null;
				const { context, id } = req.query;

				if (context === "report") {
					const { nm_pastaArquivos } = await getReporteInfo(id);
					let envName = "";
					if (process.env.NODE_ENV) {
						envName = process.env.NODE_ENV;
					} else {
						envName = "dev";
					}
					destination = `${contextDestinations[context]}/${envName}-${nm_pastaArquivos}`;
					const dir = resolve(
						__dirname,
						"..",
						"..",
						"files",
						"uploads",
						destination
					);

					if (!fs.existsSync(dir)) {
						fs.mkdirSync(dir);
					}
				} else {
					destination = contextDestinations[context];
				}
				return cb(
					null,
					resolve(__dirname, "..", "..", "files", "uploads", destination)
				);
			} catch (error) {
				console.error(error);
				throw Error(error);
			}
		},

		filename: (req, file, cb) => {
			try {
				crypto.randomBytes(16, (err, res) => {
					if (err) return cb(err);
					let envName = "";
					if (process.env.NODE_ENV) {
						envName = process.env.NODE_ENV;
					} else {
						envName = "dev";
					}
					return cb(
						null,
						`${envName}-${req.query.context}-${res.toString("hex")}${extname(
							file.originalname
						)}`
					);
				});
			} catch (error) {
				console.error(error);
				throw Error(error);
			}
		},
	}),
};
