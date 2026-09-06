import redis from "../config/redis";

export const setRedis = async (key: string, value: string, ttl: number) => {
	await redis.set(key, value, "EX", ttl);
};

export const getRedis = async (key: string) => {
	return await redis.get(key);
};

export const deleteRedis = async (key: string) => {
	await redis.del(key);
};
