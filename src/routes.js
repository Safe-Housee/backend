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
import { checkUserBlock } from "./middlewares/checkUserBlock";

const routes = Router();
const upload = multer(multerConfig);

routes.get("/", (req, res) => res.send("Safe House"));
routes.post("/usuarios", UserController.create);
routes.post("/login", LoginController.store);
routes.use(auth);
routes.use(checkUserBlock);

// Usuários routes
routes.put("/usuarios", UserController.update);
routes.get("/usuarios/:usuarioId", UserController.index);
routes.patch("/usuarios/:cdUsuario/block", UserController.block);
// Partidas routes
routes.post("/partidas", MatchController.create);
routes.patch("/partidas/:cdPartida/usuario/:cdUsuario", MatchController.update);
routes.patch(
	"/partidas/:cdPartida/usuario/:cdUsuario/exit",
	MatchController.delete
);
routes.patch(
	"/partidas/:cdPartida/status/:dsStatus",
	MatchController.updateStatus
);
routes.get("/partidas", MatchController.index);
routes.get("/partidas/:partidaId", MatchController.getOne);

// Salvar imagens
routes.post("/uploadImage", upload.single("file"), FileController.store);

// Honra
routes.post("/partidas/:cdPartida/usuario/:cdUsuario", HonraController.store);
routes.post("/usuario/:cdUsuario/avaliacao", HonraController.store);

// Reportes
routes.post("/reporte", ReporteController.store);
routes.get("/reporte/:cdReporte", ReporteController.getOne);
routes.get("/reportes", ReporteController.index);
routes.patch("/reporte/:cdReporte", ReporteController.update);

export default routes;
