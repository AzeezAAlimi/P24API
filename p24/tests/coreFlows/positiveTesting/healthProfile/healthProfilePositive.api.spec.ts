import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { loginData } from '../../../../data/loginData';
import { healthProfileSchema } from '../../../../schemas/healthProfile.schema';
import { healthProfileData } from '../../../../data/healthProfileData';
import dotenv from 'dotenv';
dotenv.config();

const personExternalId = process.env.PERSONEXTERNALID;
const ajv = new Ajv();
addFormats(ajv);

let authToken: string;
let pid: string;

test.describe('Positive Testing - Health Profile', () => {
  test.beforeAll(
    'POST /login - valid credentials - 200 + token',
    async ({ request }) => {
      const response = await request.post('/api/test/login', {
        headers: {
          ...headers,
        },
        data: loginData.validlogin,
      });
      expect(response.status()).toBe(200);
      const body = await response.json();
      authToken = body.token;
    },
  );

  test('GET /users/me - valid token - 200 + patient data', async ({
    request,
  }) => {
    const response = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.username).toBe(personExternalId);
    expect(body.patient.personExternalId).toBe(personExternalId);
    pid = body.patient.id;
  });

  test('GET /healthprofiles/:id - Validate response schema - 200', async ({
    request,
  }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    const validate = ajv.compile(healthProfileSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });

  test('GET /healthprofiles/:id - fetch profile - 200', async ({ request }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
      },
    );
    expect(response.status()).toBe(200);
  });

  test('PUT /healthprofiles/:id - update profile - 200', async ({
    request,
  }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
        data: healthProfileData.validHealthProfile,
      },
    );
    expect(response.status()).toBe(200);
  });

  test('GET /healthprofiles/:id - verify updated profile - 200', async ({
    request,
  }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.height).toBe(100);
    expect(body.weight).toBe(100);
    expect(body.allergies).toBe('Peanuts');
    expect(body.diagnoses).toBe('Chronic sleep');
    expect(body.medication).toBe('Pills');
    expect(body.surgery).toBe('Back surgery');
  });

  test('PUT /healthprofiles/:id - reset profile - 200', async ({ request }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
        data: healthProfileData.resetHealthProfile,
      },
    );
    expect(response.status()).toBe(200);
  });
});
