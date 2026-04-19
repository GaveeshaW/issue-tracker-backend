const express = require("express");
const Issue = require("../models/issue");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Create issue
router.post("/", async (req, res) => {
  try {
    const issue = await Issue.create({
      ...req.body,
      user: req.user.userId,
    });

    res.status(201).json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all issues for logged-in user only
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find({ user: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single issue for logged-in user only
router.get("/:id", async (req, res) => {
  try {
    const issue = await Issue.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update issue for logged-in user only
router.put("/:id", async (req, res) => {
  try {
    const updated = await Issue.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete issue for logged-in user only
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Issue.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;