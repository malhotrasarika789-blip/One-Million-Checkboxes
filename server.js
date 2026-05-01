import "dotenv/config";
import http from "node:http";
import { Server } from "socket.io";
import app from "./src/app.js";

import "./src/config/redis.js";

import { setupSocket } from "./src/sockets/socketHandler.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

setupSocket(io);

server.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});