import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const database = process.env.DB_NAME!;
const username = process.env.DB_USER!;
const password = process.env.DB_PASSWORD!;
const host = process.env.DB_HOST!;
const port = Number(process.env.DB_PORT!);

async function createDatabase() {
  const connection = await mysql.createConnection({
    host,
    user: username,
    password,
    port,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end();
}

createDatabase()
  .then(() => {
    console.log('Database checked/created');
  })
  .catch((error) => {
    console.error('Error creating database:', error);
  });

const sequelize = new Sequelize(database, username, password, {
  host,
  port,
  dialect: 'mysql',
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
