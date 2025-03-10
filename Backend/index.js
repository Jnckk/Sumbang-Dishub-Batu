require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const public = require("./src/controllers/Public");
const admin = require("./src/controllers/Admin");
const users = require("./src/controllers/Users");

const app = express();

app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.REACT_APP_CLIENT_URL, // ✔️ Gunakan domain frontend yang diizinkan
    credentials: true,
  })
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Terlalu banyak permintaan login, coba lagi nanti!",
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Terlalu banyak permintaan, coba lagi nanti!",
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use("/auth", authLimiter, admin);
// app.use("/public", generalLimiter, public);

app.use("/auth", admin);
app.use("/public", public);
app.use("/users", users);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
