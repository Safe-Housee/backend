import { Router } from "express";
import { auth } from "./middlewares/tokenValidation";
import {
	LoginController,
	MatchController,
	UserController,
} from "./controllers";

const routes = Router();

routes.post("/usuarios", UserController.create);
routes.post("/login", LoginController.store);
routes.use(auth);
routes.put("/usuarios", UserController.update);

routes.get("/", (req, res) => res.send("Safe House"));
routes.post("/partidas", MatchController.create);
routes.patch("/partidas/:cdPartida/usuario/:cdUsuario", MatchController.update);
export default routes;
