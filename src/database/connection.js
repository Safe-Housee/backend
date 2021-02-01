import mysql from 'mysql2/promise';

export async function createConnection() {
  return await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'safehouse',
    database: 'safehouse',
  });
}
