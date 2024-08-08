"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisFlush = exports.deleteRedis = exports.getRedis = exports.setRedis = void 0;
const redis_1 = require("redis");
const redis_url = 'redis://localhost';
const client = (0, redis_1.createClient)({ url: redis_url });
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();
const setRedis = (key_1, value_1, ...args_1) => __awaiter(void 0, [key_1, value_1, ...args_1], void 0, function* (key, value, ex = 1800) {
    yield client.setEx(key, ex, JSON.stringify(value));
});
exports.setRedis = setRedis;
const getRedis = (key) => __awaiter(void 0, void 0, void 0, function* () {
    if (yield client.exists(key)) {
        const retrievedData = (yield client.get(key));
        return JSON.parse(retrievedData);
    }
    else {
        return null;
    }
});
exports.getRedis = getRedis;
const deleteRedis = (key) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.del(key);
});
exports.deleteRedis = deleteRedis;
const redisFlush = () => __awaiter(void 0, void 0, void 0, function* () {
    yield client.flushAll();
});
exports.redisFlush = redisFlush;
