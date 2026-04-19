const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://issue-tracker-frontend-sable.vercel.app",
        "https://issue-tracker-frontend-oavel97mj-gaveeshawelhena-2637s-projects.vercel.app"
    ],
    credentials: true
}));

const authRoutes = require('./routes/authRoutes');
const issueRoutes = require("./routes/issueRoutes");

app.get("/", (req, res) => {
    res.json({ message: "Issue Tracker API is running!" });
});
app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });