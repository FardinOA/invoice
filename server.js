import dotenv from "dotenv";
import app from "./app/config/app.config.js";
import mongoose from "mongoose";
dotenv.config();
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION!!! shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const database = process.env.DATABASE_URL.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

// Connect the database
mongoose
  .connect(database)
  .then((con) => {
    console.log("DB connection Successfully!");
  })
  .catch((err) => {
    console.log(err);
  });

// Start the server
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Application is running on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION!!!  shutting down ...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
