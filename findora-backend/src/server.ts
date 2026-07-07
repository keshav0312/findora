import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: (process.env.CORS_ORIGIN || "http://localhost:3000").split(","),
    credentials: true,
  },
});

io.on("connection", (socket) => {
  // Client emits this right after connecting (see lib/socket.ts on the
  // frontend) so the server can target real-time notifications /
  // dashboard updates at a specific user via io.to(userId).emit(...).
  socket.on("user:join", (userId: string) => {
    if (userId) socket.join(userId);
  });

  socket.on("conversation:join", (conversationId: string) => {
    socket.join(conversationId);
  });

  socket.on("conversation:leave", (conversationId: string) => {
    socket.leave(conversationId);
  });

  socket.on("typing", ({ conversationId, userId }: { conversationId: string; userId: string }) => {
    socket.to(conversationId).emit("typing", { userId });
  });
});

// Make the io instance reachable from controllers via req.app.get("io").
app.set("io", io);

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
