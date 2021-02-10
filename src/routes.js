import { Router } from 'express';
import UserController from './controllers/UserController';
import LoginController from './controllers/LoginController';
import { auth } from './middlewares/tokenValidation';

const routes = Router();

routes.post('/usuarios', UserController.create);
routes.post('/login', LoginController.store);
routes.use(auth);

routes.get('/', (req, res) => res.send('Safe House'));
export default routes;
