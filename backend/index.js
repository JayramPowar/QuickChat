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


//! Initialize socket.io
export const io = new Server(server, {
    cors: {
        origin: "*",
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
  next();
});

app.use(express.json({limit: "15mb"}));
app.use(cors());

//! API endpoints
//! API endpoints
app.use("/api/status",(req, res) => res.send("Server is live..."));
app.use("/api/auth", router);
app.use("/api/messages", msgRouter);



//? DB connection
await connectDB();

if(process.env.NODE_ENV === "production"){
    const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log("Server is running on PORT: "  + PORT);
});
}

//required for vercel deployment
export default server;