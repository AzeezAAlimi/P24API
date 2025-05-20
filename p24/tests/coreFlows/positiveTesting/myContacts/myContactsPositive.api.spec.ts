import { test, expect } from '@playwright/test';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { myContactsSchema } from '../../../../schemas/myContacts.schema';
import { contactData } from '../../../../data/myContactsData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.personalId;
const mobileNumberTest1 = process.env.mobileNumberTest1;
const mobileNumberTest2 = process.env.mobileNumberTest2;
const emailTest1 = process.env.emailTest1;
const emailTest2 = process.env.emailTest2;
const ajv = new Ajv();
addFormats(ajv);

let authToken: string;
let pid: string;

test.describe('Positive Testing - Update my Contacts', () => {
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

  test('Validate my contact schema', async ({ request }) => {
    const response = await request.get('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    const validate = ajv.compile(myContactsSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });

  test('PUT Update contact details', async ({ request }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: contactData.validContacts,
    });
    expect(response.status()).toBe(200);
    expect(contactData.validContacts.userContactInformation.email).toBe(
      emailTest1,
    );
    expect(contactData.validContacts.userContactInformation.mobileNumber).toBe(
      mobileNumberTest1,
    );
  });

  test('PUT Reset contact details', async ({ request }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: contactData.resetContacts,
    });
    expect(response.status()).toBe(200);
    expect(contactData.resetContacts.userContactInformation.email).toBe(
      emailTest2,
    );
    expect(contactData.resetContacts.userContactInformation.mobileNumber).toBe(
      mobileNumberTest2,
    );
  });
});
