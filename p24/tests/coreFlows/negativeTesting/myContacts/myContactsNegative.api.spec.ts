import { test, expect } from '@playwright/test';
import { contactData } from '../../../../data/myContactsData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.personalId;
let authToken: string;
let pid: string;

test.describe('Negative Testing - Update my Contacts', () => {
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
    const body = await response.json();
    pid = body.patient.id;
  });

  test('PUT Update contact details - Invalid data', async ({ request }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: contactData.incorrectContactType,
    });
    expect(response.status()).toBe(400);
  });

  test('PUT Update contact details - Empty contact', async ({ request }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: contactData.emptyContact,
    });
    expect(response.status()).toBe(400);
  });
});
