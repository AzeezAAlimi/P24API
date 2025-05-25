import { test, expect } from '@playwright/test';
import { headers } from '../../utils/requestHeaders';
import { loginData } from '../../data/loginData';
import dotenv from 'dotenv';
dotenv.config();

const personalId = process.env.PERSONALID;
const triageInterviewId = process.env.TRIAGEINTERVIEWID;
let authToken: string;
let pid: string;
let appoinmentId: string;
let refId: string;

test.describe.skip('Seek care E2E - paused', () => {
  test.skip('POST /login - valid credentials - 200 + token', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        ...headers,
      },
      data: loginData.validlogin,
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    authToken = body.token;
  });

  test.skip('GET /users/me/current-patient - fetch patient ID - 200', async ({
    request,
  }) => {
    const response = await request.get(
      '/api/directory2/v1/users/me/current-patient',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    pid = body.id;
    console.log(body);
  });

  test.skip('GET /activities - fetch patient activities - 200', async ({
    request,
  }) => {
    const response = await request.get('/api/front-door/v1/activities', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body);
  });

  test.skip('POST /actions - initiate appointment - 200 + appointmentId', async ({
    request,
  }) => {
    const response = await request.post('/api/actions', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
      data: {
        searchTermId: 'cough',
        conditionId: 'cough',
        type: 'SearchRecommendation',
        patientId: `${pid}`,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body);
    appoinmentId = body.id;
  });

  test.skip('POST /actions/{appointmentId}/execute/v2 - activate appointment - 200 + refId', async ({
    request,
  }) => {
    const response = await request.post(
      `/api/actions/${appoinmentId}/execute/v2`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
        data: { optionId: 'startTriage' },
      },
    );
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body);
    refId = body.executionResult.referenceId.value;
  });

  test.skip('POST /actions - submit triage recommendation - 200', async ({
    request,
  }) => {
    const response = await request.post(`/api/actions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
      data: {
        patientId: `${pid}`,
        triageInterviewId: triageInterviewId,
        type: 'TriageRecommendation',
        isChild: false,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(body);
  });

  test.skip('GET /activities - verify appointment in list - 200 + match', async ({
    request,
  }) => {
    const response = await request.get('/api/front-door/v1/activities', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        ...headers,
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    const match = body.ongoing.find((a) => a.referenceId?.value === refId);
    console.log('Found activity:', match);
  });

  test.skip('DELETE /appointments/{refId} - cancel appointment - 200', async ({
    request,
  }) => {
    const response = await request.delete(
      `/api/healthmanager/v1/appointments/${refId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...headers,
        },
      },
    );
    expect(response.status()).toBe(200);
  });
});