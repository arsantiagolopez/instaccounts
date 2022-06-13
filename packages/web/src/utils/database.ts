import { ConnectionOptions } from "typeorm";

const connection: ConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT!) || 5432,
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "main",
  synchronize: false,
  // entities: ["../entitites/*{.js,.ts}"],
};

export { connection };
