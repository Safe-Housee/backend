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

routes.get("/", (req, res) => res.send("Safe House"));
routes.post("/partidas", MatchController.create);
export default routes;
