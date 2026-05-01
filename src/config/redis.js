import { createClient } from "redis";

import dotenv from "dotenv";

dotenv.config();

export const redis =
createClient({

    url:
    process.env.REDIS_URL,
});

export const publisher =
redis.duplicate();

export const subscriber =
redis.duplicate();

redis.on(
    "error",

    (err) => {

        console.log(
            "Redis Error:",
            err
        );
    }
);

await redis.connect();

await publisher.connect();

await subscriber.connect();

console.log(
    "Redis Connected"
);