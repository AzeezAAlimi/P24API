import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loginSchema } from '../../../../schemas/login.schema';
import { loginData } from '../../../../data/loginData';

const ajv = new Ajv();
addFormats(ajv);

test.describe('Positive Testing - Login', () => {
  test('Validate Login schema', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: loginData.validlogin,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const validate = ajv.compile(loginSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });

  test('POST Login', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: loginData.validlogin,
    });
    expect(response.status()).toBe(200);
  });
});
