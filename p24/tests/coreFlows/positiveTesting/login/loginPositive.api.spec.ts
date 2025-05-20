import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loginSchema } from '../../../../schemas/login.schema';
import { loginData } from '../../../../data/loginData';

const ajv = new Ajv();
addFormats(ajv);

test.describe('Positive Testing - Login', () => {
  test('POST /api/test/login - Validate response schema - 200', async ({
    request,
  }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data: loginData.validlogin,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const validate = ajv.compile(loginSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });

  test('POST /login - valid credentials - 200 + token', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data: loginData.validlogin,
    });
    expect(response.status()).toBe(200);
  });
});
