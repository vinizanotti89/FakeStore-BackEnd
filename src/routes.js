import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer.js';

import { hasRole } from './app/middlewares/isAdmin.js';
import authMiddleware from './app/middlewares/auth.js';

import UserController from './app/controllers/UserController.js';
import SessionController from './app/controllers/SessionController.js';
import ProductController from './app/controllers/ProductController.js';
import CategoryController from './app/controllers/CategoryController.js';
import OrderController from './app/controllers/OrderController.js';
import ForgotPasswordController from './app/controllers/ForgotPasswordController.js';
import PurchaseController from './app/controllers/PurchaseController.js';

import CreatePaymentIntentController from './app/controllers/stripe/CreatePaymentIntentController.js';

const routes = Router();

const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.post('/reset-password', ForgotPasswordController.createToken);
routes.get('/reset-token/:token', ForgotPasswordController.getUserByToken);
routes.post('/reset-password/:token', ForgotPasswordController.resetPassword);

// Rotas públicas de produtos e categorias
routes.get('/products/offers', ProductController.getOffers); // Rota para produtos em oferta
routes.get('/products/category/:categoryId', ProductController.getByCategory); // Produtos por categoria
routes.get('/products/:id', ProductController.show); // Detalhes de um produto específico
routes.get('/categories', CategoryController.index);

// Rotas administrativas de produtos
routes.post('/products', hasRole('admin'), upload.single('file'), ProductController.store);
routes.get('/products', hasRole('admin'), ProductController.index);
routes.put('/products/:id', hasRole('admin'), upload.single('file'), ProductController.update);

routes.post('/categories', hasRole('admin'), upload.single('file'), CategoryController.store);
routes.put('/categories/:id', hasRole('admin'), upload.single('file'), CategoryController.update);

routes.use(authMiddleware); // Aplica authMiddleware para todas as rotas abaixo

routes.get("/purchases", PurchaseController.index);
routes.post("/save-purchase", PurchaseController.store);

routes.post('/orders', OrderController.store);
routes.get('/orders', hasRole('admin'), OrderController.index);
routes.put('/orders/:id', hasRole('admin'), OrderController.update); 

routes.post('/create-payment-intent', CreatePaymentIntentController.store);

export default routes;