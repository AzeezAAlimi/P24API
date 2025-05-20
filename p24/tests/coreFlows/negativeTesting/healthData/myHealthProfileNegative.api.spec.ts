import { test, expect } from '@playwright/test';
import { healthProfileData } from '../../../../data/healthProfileData';

let authToken: string;
let pid: string;

test.describe('Negative Testing - Health Profile', () => {
  test.beforeAll('POST Login', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: {
        surname: 'Hansson',
        givenName: 'Alex',
        nationalPersonalId: '199008292394',
        personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    authToken = body.token;
  });

  test('GET User details', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    pid = body.patient.id;
  });

  test('Get Health Profile - Invalid patient id', async ({ request }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/3456667`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status()).toBe(403);
  });

  test('PUT Health Profile - Exceeding height and weight limit', async ({
    request,
  }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
        data: healthProfileData.overLimitHealthProfile,
      },
    );
    expect(response.status()).toBe(400);
  });

  test('PUT Health Profile - Sending unsupported fields', async ({
    request,
  }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
        data: healthProfileData.stringInsteadOfNumber,
      },
    );
    expect(response.status()).toBe(400);
  });

  test('Get Health Profile - Invalid URL', async ({ request }) => {
    const response = await request.get(`/api/healthmanager/9/hea`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    expect(response.status()).toBe(404);
  });
});
