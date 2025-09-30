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

    // ✅ CORS para liberar acesso ao frontend
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || '*',
    }));

    // ✅ Permite receber JSON no body das requisições
    this.app.use(express.json());

    // ✅ Servindo arquivos estáticos de /uploads
    this.app.use('/uploads', express.static(resolve(__dirname, '..', 'uploads')));

    // ✅ Definindo as rotas da aplicação
    this.app.use(routes);
  }
}

export default new App().app;
