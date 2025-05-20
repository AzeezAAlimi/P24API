import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { healthProfileSchema } from '../../../../schemas/healthProfile.schema';
import { healthProfileData } from '../../../../data/healthProfileData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.personalId;
const personExternalId = process.env.personExternalId;
const ajv = new Ajv();
addFormats(ajv);

let authToken: string;
let pid: string;

test.describe('Positive Testing - Health Profile', () => {
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
        nationalPersonalId: personalId,
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
    expect(body.username).toBe(personExternalId);
    expect(body.patient.personExternalId).toBe(personExternalId);
    pid = body.patient.id;
  });

  test('Validate Health Profile schema', async ({ request }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
      },
    );
    const body = await response.json();
    const validate = ajv.compile(healthProfileSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });

  test('Get Health Profile', async ({ request }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
      },
    );
    expect(response.status()).toBe(200);
  });

  test('PUT Health Profile', async ({ request }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
        data: healthProfileData.validHealthProfile,
      },
    );
    expect(response.status()).toBe(200);
  });

  test('Get Health Profile update', async ({ request }) => {
    const response = await request.get(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
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

  test('PUT reset Health Profile', async ({ request }) => {
    const response = await request.put(
      `/api/healthmanager/v1/healthprofiles/${pid}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
        data: healthProfileData.resetHealthProfile,
      },
    );
    expect(response.status()).toBe(200);
  });
});
