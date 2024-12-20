import { Sequelize } from 'sequelize';
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL!;

async function createDatabase() {
  const client = new Client({
    connectionString: databaseUrl,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  await client.connect();
  const dbName = process.env.DB_NAME;

  // Check if the database exists, and create it if it doesn't
  const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}';`);
  if (res.rowCount === 0) {
    await client.query(`CREATE DATABASE ${dbName};`);
    console.log(`Database ${dbName} created`);
  } else {
    console.log(`Database ${dbName} already exists`);
  }

  await client.end();
}

createDatabase()
  .then(() => {
    console.log('Database checked/created');
  })
  .catch((error) => {
    console.error('Error creating database:', error);
  });

// Initialize Sequelize instance
const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Adjust based on provider's requirements
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
