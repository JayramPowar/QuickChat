import express from 'express';
import "dotenv/config";
import cors from "cors";
import connectDB from './lib/db.js';
import router from './routes/userRoutes.js';
import msgRouter from './routes/messageRoutes.js';

const app = express();

// Middlewares
app.use(express.json({limit: "15mb"}));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            "https://quick-chat-kappa-cyan.vercel.app",
            "http://localhost:5173",
            "http://localhost:5000"
        ];
        
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB Connection Failed:", error);
    res.status(500).json({ 
      success: false, 
      message: "Database connection failed" 
    });
  }
});

// API endpoints
app.get("/api/status", (req, res) => res.json({ success: true, message: "Server is live..." }));
app.use("/api/auth", router);
app.use("/api/messages", msgRouter);

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({ success: false, message: err.message });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log("Server running on PORT:", PORT);
  });
}

export default app;