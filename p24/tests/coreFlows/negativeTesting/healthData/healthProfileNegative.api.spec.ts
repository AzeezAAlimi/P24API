import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import { loginData } from '../../../../data/loginData';
import { healthProfileData } from '../../../../data/healthProfileData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.PERSONALID;
let authToken: string;
let pid: string;

test.describe('Negative Testing - Health Profile', () => {
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
    pid = body.patient.id;
  });

  test('GET /healthprofiles/:id - invalid patient ID - 403', async ({
    request,
  }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/3456667`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
      },
    );
    expect(response.status()).toBe(403);
  });

  test('PUT /healthprofiles/:id - height/weight too large - 400', async ({
    request,
  }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
        data: healthProfileData.overLimitHealthProfile,
      },
    );
    expect(response.status()).toBe(400);
  });

  test('PUT /healthprofiles/:id - unsupported fields - 400', async ({
    request,
  }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
        data: healthProfileData.stringInsteadOfNumber,
      },
    );
    expect(response.status()).toBe(400);
  });

  test('GET /healthmanager/9/hea - invalid URL - 404', async ({ request }) => {
    const response = await request.get(`/api/healthmanager/9/hea`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(404);
  });
});
