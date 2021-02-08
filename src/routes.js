import { Router } from 'express';
import UserController from './controllers/UserController';
import { auth } from './middlewares/tokenValidation';

const routes = Router();

routes.post('/usuarios', UserController.create);

routes.use(auth)

routes.get('/', (req, res) => {
    return res.send('Safe House');
})
export default routes;
