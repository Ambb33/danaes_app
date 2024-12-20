import { Sequelize } from 'sequelize';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL!;

async function createDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Adjust based on your provider's requirements
    },
  });

  await client.connect();
  await client.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
  await client.end();
}

createDatabase()
  .then(() => {
    console.log('Database checked/created');
  })
  .catch((error) => {
    console.error('Error creating database:', error);
  });

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Adjust based on your provider's requirements
    },
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

export default sequelize;
