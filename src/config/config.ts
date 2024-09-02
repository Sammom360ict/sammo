import dotenv from "dotenv";
import path from "path";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Env types
interface ENV {
  PORT: number | undefined;
  DB_NAME: string | undefined;
  DB_PASS: string | undefined;
  DB_USER: string | undefined;
  DB_PORT: string | undefined;
  DB_HOST: string | undefined;
  JWT_SECRET_ADMIN: string | undefined;
  JWT_SECRET_USER: string | undefined;
  JWT_SECRET_AGENT: string | undefined;
  EMAIL_SEND_EMAIL_ID: string | undefined;
  EMAIL_SEND_PASSWORD: string | undefined;
  GOOGLE_CLIENT_SECRET: string | undefined;
  GOOGLE_CLIENT_ID: string | undefined;
  AWS_S3_BUCKET: string | undefined;
  AWS_S3_ACCESS_KEY: string | undefined;
  AWS_S3_SECRET_KEY: string | undefined;
  SSL_URL: string | undefined;
  SSL_STORE_ID: string | undefined;
  SSL_STORE_PASSWORD: string | undefined;
  SABRE_PASSWORD: string | undefined;
  SABRE_AUTH_TOKEN: string | undefined;
  SABRE_URL: string | undefined;
  SABRE_USERNAME: string | undefined;
}

// Config types
interface Config {
  PORT: number;
  DB_NAME: string;
  DB_PASS: string;
  DB_USER: string;
  DB_PORT: string;
  DB_HOST: string;
  JWT_SECRET_ADMIN: string;
  JWT_SECRET_USER: string;
  JWT_SECRET_AGENT: string;
  EMAIL_SEND_EMAIL_ID: string;
  EMAIL_SEND_PASSWORD: string;
  AWS_S3_BUCKET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  AWS_S3_ACCESS_KEY: string;
  AWS_S3_SECRET_KEY: string;
  SSL_URL: string;
  SSL_STORE_ID: string;
  SSL_STORE_PASSWORD: string;
  SABRE_AUTH_TOKEN: string;
  SABRE_PASSWORD: string;
  SABRE_URL: string;
  SABRE_USERNAME: string;
}

// Loading process.env as  ENV interface
const getConfig = (): ENV => {
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
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
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

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in .env`);
    }
  }
  return config as Config;
};

export default getSanitzedConfig(getConfig());
