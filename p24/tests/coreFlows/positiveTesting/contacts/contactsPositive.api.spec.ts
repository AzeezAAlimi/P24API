import { test, expect } from '@playwright/test';
import { headers } from '../../../../utils/requestHeaders';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { myContactsSchema } from '../../../../schemas/myContacts.schema';
import { contactData } from '../../../../data/contactsData';
import { loginData } from '../../../../data/loginData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.PERSONALID;
const mobileNumberTest1 = process.env.MOBILENUMBERTEST1;
const mobileNumberTest2 = process.env.MOBILENUMBERTEST2;
const emailTest1 = process.env.EMAILTEST1;
const emailTest2 = process.env.EMAILTEST2;
const ajv = new Ajv();
addFormats(ajv);

let authToken: string;
let pid: string;

test.describe('Positive Testing - Contacts', () => {
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

  test('POST /users/me/profile - Validate response schema - 200', async ({
    request,
  }) => {
    const response = await request.get('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const validate = ajv.compile(myContactsSchema);
    const valid = validate(body);
    expect(valid).toBe(true);
  });

  test('PUT /users/me/profile - Update contact details - 200', async ({
    request,
  }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
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

  test('PUT /users/me/profile - Reset contact details - 200', async ({
    request,
  }) => {
    const response = await request.put('/api/directory2/v1/users/me/profile', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
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
