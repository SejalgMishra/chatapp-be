import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import userRoute from "./routes/userRoute";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", userRoute);

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1/ChatApplication");
    console.log("database connected...");
  } catch (error) {
    console.log(error);
  }
};
connectDB();


app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
