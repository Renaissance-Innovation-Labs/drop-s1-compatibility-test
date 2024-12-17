import { config } from "dotenv";
config();

export const CREDENTIALS = process.env.CREDENTIALS === "true";
export const {
  NODE_ENV,
  PORT,
  LOG_FORMAT,
  LOG_DIR,
  MONGODB_URI,
  ACCESS_TOKEN,
  MAIL_PASS, MAIL_SERVICE, MAIL_USER,
  FRONTEND_URL,
  OPEN_AI_API_KEY
} = process.env;