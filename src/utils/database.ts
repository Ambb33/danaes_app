import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('Connected to the database');
});

export default pool;

async function createDatabase() {
  const client = await pool.connect();
  const dbName = process.env.DB_NAME;

  try {
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}';`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName};`);
      console.log(`Database ${dbName} created`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
  } finally {
    client.release();
  }
}

createDatabase()
  .then(() => console.log('Database checked/created'))
  .catch((error) => console.error('Error creating database:', error));
