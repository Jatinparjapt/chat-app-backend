const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createServer } = require("http");
const { Server } = require("socket.io");
const messageRoutes = require("./routes/messageRoutes");
const Message = require("./database/Model/Message");

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/api/messages", messageRoutes);

// Socket.IO for real-time updates
io.on("connection", (socket) => {
  console.log("A user connected");

  // Send all messages when a new user connects
  socket.on("fetchMessages", async () => {
    const messages = await Message.findAll({ order: [["timestamp"]] });
    socket.emit("messages", messages);
  });

  // Broadcast a new message to all users
  socket.on("sendMessage", async (data) => {
    const { user, message } = data;
    const newMessage = await Message.create({ user, message });
    io.emit("newMessage", newMessage);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
