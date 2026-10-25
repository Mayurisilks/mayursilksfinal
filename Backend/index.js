import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Routes from "./router.js";

dotenv.config();

const app = express();

app.use(
  bodyParser.json({
    limit: "30mb",
  })
);

app.use(
  bodyParser.urlencoded({
    limit: "30mb",
    extended: true,
  })
);

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.app_MONGO_URI;

if (!MONGO_URI) {
  console.error("MongoDB connection string is missing.");
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  });

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Mayuri Silks API is running",
  });
});

app.use("/api", Routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
