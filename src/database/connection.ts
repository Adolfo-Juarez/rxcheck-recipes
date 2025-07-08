import dotenv from "dotenv";
import mysql from "mysql2/promise";

dotenv.config();

const config = {
  host: process.env.SQL_HOST,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  port: parseInt(process.env.SQL_PORT ?? "3306"),
};

const connection_pool = mysql.createPool(config);

export default async function query(query_sentence: string, params: any[]) {
  try {
    const current_connection = await connection_pool.getConnection();
    console.log("Conexión a la base de datos exitosa.");
    const result = await current_connection.execute(query_sentence, params);
    current_connection.release();
    return result;
  } catch (error) {
    console.error("Ha ocurrido un error con tu peticion:" + error);
    return null;
  }
}