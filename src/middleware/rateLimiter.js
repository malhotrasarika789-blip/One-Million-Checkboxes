import { redis } from "../config/redis.js";

export const socketRateLimiter = async (
    socketId
) => {

    const key = `rate-limit:${socketId}`;

    const current =
        await redis.incr(key);

    if (current === 1) {

        await redis.expire(key, 10);
    }

    if (current > 20) {

        return false;
    }

    return true;
};