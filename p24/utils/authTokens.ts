import dotenv from 'dotenv';
dotenv.config();

export const expiredToken = process.env.expired_auth_token; //'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...';
export const malformedToken = process.env.malformed_token; //'fake.token';
