import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import connectDB from './lib/db.js';
import router from './routes/userRoutes.js';
import msgRouter from './routes/messageRoutes.js';
import {Server} from "socket.io";

const app = express();
const server = http.createServer(app);

//! Initialize socket.io with CORS
export const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl)
            if (!origin) return callback(null, true);
            
            // Allow any Vercel URL or localhost
            if (origin.endsWith('.vercel.app') || origin.includes('localhost')) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        },
        credentials: true,
        methods: ["GET", "POST"]
    },
});

//* Store online users
export const userSocketMap = {};

//* Socket connection handler
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    console.log("User Connected", userId);

    if(userId){
        userSocketMap[userId] = socket.id;
    }

    //?emit all online users to frontend
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("User disconnected: ", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
});

//! middlewares
app.use((req, res, next) => {
  console.log("➡️ INCOMING:", req.method, req.originalUrl);
  next();
});

app.use(express.json({limit: "15mb"}));

// ✅ CORS Configuration - Allow Vercel deployments
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        // Allow your frontend domains
        const allowedOrigins = [
            "https://quick-chat-kappa-cyan.vercel.app",
            "http://localhost:5173",
            "http://localhost:5000"
        ];
        
        // Allow any Vercel preview URL or localhost
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

//! API endpoints
app.use("/api/status",(req, res) => res.send("Server is live..."));
app.use("/api/auth", router);
app.use("/api/messages", msgRouter);

//? DB connection
await connectDB();

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV !== "production"){
    server.listen(PORT, () => {
    console.log("Server is running on PORT: "  + PORT);
});
}

export default server;