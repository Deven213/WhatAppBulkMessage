require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
const { Server } = require("socket.io");

<<<<<<< HEAD
// ─── Puppeteer / Chrome Fix (REQUIRED for Render.com) ────────────────────────
process.env.PUPPETEER_CACHE_DIR = "/opt/render/.cache/puppeteer";
=======
// Puppeteer Cache Path handled in Services
>>>>>>> master

// ─── App & Server Setup ───────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─── Socket.IO Setup ─────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Attach socket.io to every request so controllers can emit live updates
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ─── MongoDB Connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// ─── Routes ──────────────────────────────────────────────────────────────────
const campaignRoutes = require("./routes/campaignRoutes");
const whatsappRoutes = require("./routes/whatsappRoutes");
const webhookRoutes  = require("./routes/webhookRoutes");

app.use("/api/campaigns", campaignRoutes);
app.use("/api/whatsapp",  whatsappRoutes(io));
app.use("/api/webhook",   webhookRoutes(io));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "WhatsApp Bulk Messenger API is running 🚀" });
});

// ─── Socket.IO Events ────────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  socket.on("disconnect", () => {
    console.log("🔌 Client disconnected:", socket.id);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ─── Crash Handlers ───────────────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
});
