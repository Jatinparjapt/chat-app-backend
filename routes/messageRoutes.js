const express = require("express");
const router = express.Router();
const Message = require("../database/Model/Message");

// Fetch all messages (optional for non-Socket.IO clients)
router.get("/", async (req, res) => {
  try {
    const messages = await Message.findAll({ order: [["timestamp"]] });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

module.exports = router;
