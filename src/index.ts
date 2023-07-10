import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

import bodyParser from "body-parser";
import userRoute from "./routes/userRoute";


dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.use("/", userRoute);


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});


