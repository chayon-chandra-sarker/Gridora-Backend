import Redis from "ioredis";
import config from ".";

const redis = new Redis(config.redis_url);

redis.on("connect", () => {
	console.log("Redis connected successfully");
});

redis.on("error", (error) => {
	console.error("Redis connection error:", error);
});

export default redis;
