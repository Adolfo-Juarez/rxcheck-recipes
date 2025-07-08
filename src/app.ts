import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./recipe/infrastructure/router";

dotenv.config();

const APP_PORT = process.env.PORT || 3000;
const server = express();

server.use(cors());
server.use(express.json());

server.use("/recipe", router);

server.listen(APP_PORT, () => {
  console.log(`Server running on port ${APP_PORT}`);
});
