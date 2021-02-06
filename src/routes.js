import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = Router();

routes.post('/usuarios', UserController.create);
routes.put('/usuarios', UserController.update);

export default routes;
