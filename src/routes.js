import { Router } from "express";
import multer from "multer";
import { auth } from "./middlewares/tokenValidation";
import {
	LoginController,
	MatchController,
	UserController,
	FileController,
	HonraController,
	ReporteController,
} from "./controllers";
import multerConfig from "./config/multer";

const routes = Router();
const upload = multer(multerConfig);

routes.get("/", (req, res) => res.send("Safe House"));
routes.post("/login", LoginController.store);
routes.post("/usuarios", UserController.create);
routes.use(auth);
// Usuários routes
routes.put("/usuarios", UserController.update);
routes.get("/usuarios/:usuarioId", UserController.index);
// Partidas routes
routes.post("/partidas", MatchController.create);
routes.patch("/partidas/:cdPartida/usuario/:cdUsuario", MatchController.update);
routes.patch(
	"/partidas/:cdPartida/usuario/:cdUsuario/exit",
	MatchController.delete
);
routes.get("/partidas", MatchController.index);
routes.get("/partidas/:partidaId", MatchController.getOne);
// Salvar imagens
routes.post("/uploadImage", upload.single("file"), FileController.store);
// Honra
routes.post("/partidas/:cdPartida/usuario/:cdUsuario", HonraController.store);
// Reportes
routes.post("/reporte", ReporteController.store);
export default routes;
