import { Router } from 'express';
import UserController from './controllers/UserController';

const routes = Router();
routes.get('/users', UserController.create);



export default routes;