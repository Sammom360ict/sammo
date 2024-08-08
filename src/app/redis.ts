import { createClient } from 'redis';

const redis_url = 'redis://localhost';

const client = createClient({ url: redis_url });

client.on('error', (err) => console.log('Redis Client Error', err));

client.connect();

export const setRedis = async (key: string, value: any, ex = 1800) => {
  await client.setEx(key, ex, JSON.stringify(value));
};

export const getRedis = async (key: string) => {
  if (await client.exists(key)) {
    const retrievedData = (await client.get(key)) as string;

    return JSON.parse(retrievedData);
  } else {
    return null;
  }
};

export const deleteRedis = async (key: string) => {
  await client.del(key);
};
export const redisFlush = async () => {
  await client.flushAll();
};
