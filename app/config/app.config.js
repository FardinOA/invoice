import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import cors from "cors";
import AppError from "../utils/appError.js";
import globalError from "../utils/globalError.js";

// routes import
import userRoutes from "../routes/userRoutes.js";

// define the application
const app = express();

var whitelist = [
  "http://localhost:5173",
  "https://invoice-frontend-6usm2buh1-fardinoas-projects.vercel.app",
  "*",
];
var corsOptions = {
  origin: whitelist,

  credential: true,
};
// Allow Cross-Origin requests
app.use(
  cors({
    origin: "*",
  })
);

// Set security HTTP headers
app.use(helmet());

// Limit request from the same API
const limiter = rateLimit({
  max: 150,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: "Too Many Requests from this IP, please try again in an hour",
});

app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: "15kb",
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

// define routes
app.use("/api/v1/users", userRoutes);

// handle undefined Routes
app.use("*", (req, res, next) => {
  const err = new AppError(404, "Not Found");

  console.log(err);
  next(err, req, res, next);
});

app.use(globalError);
export default app;
