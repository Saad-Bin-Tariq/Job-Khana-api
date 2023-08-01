require("dotenv").config();
require("express-async-errors");
const authenticateUser = require("./middleware/authentication");
const express = require("express");
// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

const app = express();
//connect DB
const connectDB = require("./db/connect");
//routes import
const authRoutes = require("./routes/auth");
const jobRoutes = require("./routes/jobs");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(
  rateLimiter({
    windowMs: 10 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(xss());
// extra packages

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/jobs", authenticateUser, jobRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
