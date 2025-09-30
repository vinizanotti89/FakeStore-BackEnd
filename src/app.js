import express from 'express';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes.js';
import cors from 'cors';
import './database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class App {
  constructor() {
    this.app = express();

    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "*"
    }));

    // Servindo arquivos estáticos de /uploads
    this.app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(express.json());

    this.app.use(
      '/product-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
    this.app.use(
      '/category-file',
      express.static(resolve(__dirname, '..', 'uploads'))
    );
  }

  routes() {
    this.app.use(routes);
  }
}

export default new App().app;
