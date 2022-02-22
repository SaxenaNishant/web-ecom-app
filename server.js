require("dotenv").config({
  path: "./config.env",
});
const express = require("express");
const connectDb = require("./config/db");
const errorHandler = require("./middleware/error");
// connect DB

connectDb();

const app = express();

app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

// error handler should be last piece of middleware

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
  console.log(`Server is running on ${PORT}`)
);

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged error ${err}`);

  server.close(() => process.exit(1));
});
