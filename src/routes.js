import { Router } from "express";
import { auth } from "./middlewares/tokenValidation";
import {
	LoginController,
	MatchController,
	UserController,
} from "./controllers";

const routes = Router();

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

export default routes;
