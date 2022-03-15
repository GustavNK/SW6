import * as dotenv from 'dotenv';

dotenv.config();

export const isDev = process.env.NODE_ENV !== 'production';

export const PORT = process.env.PORT;

export const pgConnectionString = process.env.PG_CONNECTION_STRING;