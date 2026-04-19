const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

/**
 * ✅ Allowed origins (LOCAL + VERCEL)
 */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://issue-tracker-frontend-sable.vercel.app",
  "https://issue-tracker-frontend-oavel97mj-gaveeshawelhena-2637s-projects.vercel.app"
];

/**
 * ✅ CORS CONFIG (handles Vercel dynamic URLs safely)
 */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow REST tools like Postman (no origin)
      if (!origin) return callback(null, true);

      // allow localhost + vercel
      if (
        origin.includes("localhost") ||
        origin.includes("vercel.app")
      ) {
        return callback(null, true);
      }

      // or strict match (optional fallback)
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/**
 * Middleware
 */
app.use(express.json());

/**
 * Routes
 */
const authRoutes = require("./routes/authRoutes");
const issueRoutes = require("./routes/issueRoutes");

app.get("/", (req, res) => {
  res.json({ message: "Issue Tracker API is running!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

/**
 * MongoDB + Server start
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });