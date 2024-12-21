"use server";
import { neon } from "@neondatabase/serverless";

export async function getData() {
  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = neon(databaseUrl);
  const data = await sql`SELECT * FROM your_table`; // Replace with your actual query
  return data;
}
