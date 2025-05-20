import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import { contactData } from '../../../../data/contactsData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.PERSONALID;
let authToken: string;
let pid: string;

test.describe('Negative Testing - Contacts', () => {
  test.beforeAll(
    'POST /login - valid credentials - 200 + token',
    async ({ request }) => {
      const response = await request.post('/api/test/login', {
        headers: {
          ...headers,
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

  test('PUT /users/me/profile - invalid contact data - 400', async ({
    request,
  }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
      data: contactData.incorrectContactType,
    });
    expect(response.status()).toBe(400);
  });

  test('PUT /users/me/profile - empty contact fields - 400', async ({
    request,
  }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
      data: contactData.emptyContact,
    });
    expect(response.status()).toBe(400);
  });
});
