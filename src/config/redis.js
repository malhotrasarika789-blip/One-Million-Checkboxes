import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redis = createClient({
    url: process.env.REDIS_URL,
});

export const publisher = createClient({
    url: process.env.REDIS_URL,
});

export const subscriber = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
    console.log("Redis Error:", err);
});

export const connectRedis = async () => {
    try {
        await redis.connect();
        await publisher.connect();
        await subscriber.connect();

        console.log("Redis Connected");
    } catch (err) {
        console.log("Redis Connection Failed:", err);
    }
};