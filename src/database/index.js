import Sequelize from "sequelize";
import mongoose from "mongoose";

import configDatabase from "../config/database.js";

import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";

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
