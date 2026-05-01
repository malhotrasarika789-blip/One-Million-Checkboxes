import { redis, publisher, subscriber } from "../config/redis.js";
import { socketRateLimiter } from "../middleware/rateLimiter.js";
import { verifyToken } from "../middleware/authMiddleware.js";

let activeUsers = 0;
    export const setupSocket = (io) => {
    io.on( "connection", async (socket) => {
        const token = socket.handshake.auth.token;

            const user =
            verifyToken(token);

            if (!user) {
                socket.disconnect();
                return;
            }
            activeUsers++;
            io.emit("users-update", activeUsers);
            console.log("Authenticated User:", user.username);

            const checkboxState = await redis.hGetAll("checkboxes");
            socket.emit("initial-state", checkboxState);
            socket.on("toggle-checkbox", async (data) => {
                const allowed = await socketRateLimiter(socket.id);
            if (!allowed){
                socket.emit("rate-limit-exceeded", {
                message: "Too many requests"
                            }
                        );
                        return;
                    }

                    const {index,checked} = data;

                    await redis.hSet("checkboxes",index,String(checked));

                    await publisher.publish("checkbox-updates",JSON.stringify(data));
                }
            );

            socket.on("disconnect", () => {
            activeUsers--;
            io.emit("users-update", activeUsers);
            console.log( "User disconnected:", socket.id );
                }
            );
        }
    );
};

export const setupRedisSubscriber = (io) => {
        subscriber.subscribe("checkbox-updates", (message) => {
        const data = JSON.parse(message);
            io.emit("checkbox-updated", data);
        }
    );
};