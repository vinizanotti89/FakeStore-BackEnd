import Sequelize from "sequelize";
import mongoose from "mongoose";
import configDatabase from "../config/database.js";

import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";
import dotenv from 'dotenv';

dotenv.config();
console.log("MONGO_URI:", process.env.MONGO_URI);


const mongoUri = process.env.MONGO_URI;

console.log("Mongo URI:", mongoUri); // Verifique se a URL está sendo lida corretamente

if (!mongoUri) {
  console.error("Erro: MONGO_URI não encontrado. Verifique o arquivo .env.");
  process.exit(1); // Se a variável não estiver presente, sai da aplicação
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB conectado com sucesso!'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

const models = [User, Product, Category];

class Database {
  constructor() {
    this.initRelational();
    this.initMongo();
  }

  // Conexão Sequelize (Postgres)
  initRelational() {
    this.connection = new Sequelize(configDatabase);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  // Conexão Mongoose (MongoDB)
  async initMongo() {
    const mongoUri =
      process.env.MONGO_URI || "mongodb://localhost:27017/fakestore";

    try {
      this.mongoConnection = await mongoose.connect(mongoUri);
      console.log(
        `[MongoDB] Conectado em: ${process.env.MONGO_URI ? "Atlas" : "Local"}`
      );
    } catch (err) {
      console.error("[MongoDB] Erro ao conectar:", err.message);
    }
  }
}

export default new Database();
