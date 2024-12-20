// scripts/initializeDatabase.ts

import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function initializeDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Test" (
        id SERIAL PRIMARY KEY,
        testType VARCHAR(255) NOT NULL,
        score INTEGER NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "TestQuestion" (
        id SERIAL PRIMARY KEY,
        testId INTEGER NOT NULL REFERENCES "Test"(id) ON DELETE CASCADE,
        question TEXT NOT NULL,
        userAnswer TEXT NOT NULL,
        correctAnswer TEXT NOT NULL,
        isCorrect BOOLEAN NOT NULL
      );
    `);

    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    client.release();
  }
}

initializeDatabase()
  .then(() => console.log('Database schema created'))
  .catch((error) => console.error('Initialization error:', error));
