"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Parsing the env file.
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Loading process.env as  ENV interface
const getConfig = () => {
    return {
        PORT: process.env.PORT ? Number(process.env.PORT) : 9005,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASS: process.env.DB_PASS,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        JWT_SECRET_ADMIN: process.env.JWT_SECRET_ADMIN,
        JWT_SECRET_USER: process.env.JWT_SECRET_USER,
        JWT_SECRET_AGENT: process.env.JWT_SECRET_AGENT,
        EMAIL_SEND_EMAIL_ID: process.env.EMAIL_SEND_EMAIL_ID,
        EMAIL_SEND_PASSWORD: process.env.EMAIL_SEND_PASSWORD,
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET,
        AWS_S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY,
        AWS_S3_SECRET_KEY: process.env.AWS_S3_SECRET_KEY,
        SSL_URL: process.env.SSL_URL,
        SSL_STORE_ID: process.env.SSL_STORE_ID,
        SSL_STORE_PASSWORD: process.env.SSL_STORE_PASSWORD,
        SABRE_PASSWORD: process.env.SABRE_PASSWORD,
        SABRE_AUTH_TOKEN: process.env.SABRE_AUTH_TOKEN,
        SABRE_URL: process.env.SABRE_URL,
        SABRE_USERNAME: process.env.SABRE_USERNAME,
    };
};
const getSanitzedConfig = (config) => {
    for (const [key, value] of Object.entries(config)) {
        if (value === undefined) {
            throw new Error(`Missing key ${key} in .env`);
        }
    }
    return config;
};
exports.default = getSanitzedConfig(getConfig());
