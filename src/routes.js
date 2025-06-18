import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import { hasRole } from './app/middlewares/isAdmin';
import authMiddleware from './app/middlewares/auth';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import CategoryController from './app/controllers/CategoryController';
import OrderController from './app/controllers/OrderController';

const routes = Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware); // Aplica authMiddleware para todas as rotas abaixo

routes.post('/products', hasRole('admin'), upload.single('file'), ProductController.store);
routes.get('/products', hasRole('admin'), ProductController.index);
routes.put('/products/:id', hasRole('admin'), upload.single('file'), ProductController.update);

routes.post('/categories', hasRole('admin'), upload.single('file'),CategoryController.store);
routes.get('/categories', CategoryController.index);
routes.put('/categories/:id', hasRole('admin'), upload.single('file'),CategoryController.update);

routes.post('/orders', OrderController.store);
routes.get('/orders', hasRole('admin'), OrderController.index);
routes.put('/orders/:id', hasRole('admin'), OrderController.update); 

export default routes;