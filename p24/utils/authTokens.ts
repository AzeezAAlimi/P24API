import dotenv from 'dotenv';
dotenv.config();

export const expiredToken = process.env.EXPIRED_AUTH_TOKEN as string; //'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...';
export const malformedToken = process.env.MALFORMED_TOKEN as string; //'fake.token';
