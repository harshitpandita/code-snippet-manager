const express = require("express");
const router = express.Router();
const Snippet = require("../models/Snippet");

// Create snippet
router.post("/", async (req, res) => {
  try {
    const { title, language, tags, code } = req.body;

    const snippet = new Snippet({
      title,
      language,
      tags,
      code
    });

    const savedSnippet = await snippet.save();
    res.json(savedSnippet);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all snippets
router.get("/", async (req, res) => {
  try {
    const snippets = await Snippet.find().sort({ createdAt: -1 });
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete snippet
router.delete("/:id", async (req, res) => {
  try {
    await Snippet.findByIdAndDelete(req.params.id);
    res.json({ message: "Snippet deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;