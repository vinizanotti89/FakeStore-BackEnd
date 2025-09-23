import 'dotenv/config';

const configDatabase = {
  dialect: process.env.DB_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'fakestore',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};

export default configDatabase;