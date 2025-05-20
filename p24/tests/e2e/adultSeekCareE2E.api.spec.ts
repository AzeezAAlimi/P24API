import { test, expect } from '@playwright/test';

let authToken: string;
let pid: string;
let appoinmentId: string;
let refId: string;

test.describe('Seek care E2E', () => {
  test('POST Login', async ({ request }) => {
    const response = await request.post('/api/test/login', {
      headers: {
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: {
        surname: 'Hansson',
        givenName: 'Alex',
        nationalPersonalId: '199305022395',
        personalIdType: 'SWEDISH_PERSONAL_IDENTITY_NUMBER',
      },
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    authToken = body.token;
  });

  test('GET User details', async ({ request }) => {
    const response = await request.get(
      '/api/directory2/v1/users/me/current-patient',
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
    pid = body.id;
    console.log(body);
  });

  test('GET My activites', async ({ request }) => {
    const response = await request.get('/api/front-door/v1/activities', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    console.log(body);
  });

  test('POST Initiate appointment request', async ({ request }) => {
    const response = await request.post('/api/actions', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: {
        searchTermId: 'cough',
        conditionId: 'cough',
        type: 'SearchRecommendation',
        patientId: `${pid}`,
      },
    });
    const body = await response.json();
    console.log(body);
    appoinmentId = body.id;
  });

  test('POST Activate appointment request', async ({ request }) => {
    const response = await request.post(
      `/api/actions/${appoinmentId}/execute/v2`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
        data: { optionId: 'startTriage' },
      },
    );
    const body = await response.json();
    console.log(body);
    refId = body.executionResult.referenceId.value;
  });

  test('POST Triage recommendation', async ({ request }) => {
    const response = await request.post(`/api/actions`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
      data: {
        patientId: `${pid}`,
        triageInterviewId: '9a71c917-0fc5-449a-8755-472d72ce1ef4',
        type: 'TriageRecommendation',
        isChild: false,
      },
    });
    const body = await response.json();
    console.log(body);
  });

  test('GET Verify appointment in My activites', async ({ request }) => {
    const response = await request.get('/api/front-door/v1/activities', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json, text/plain, */*',
        'X-Origin': 'doktor24',
        'Content-Type': 'application/json',
      },
    });
    const body = await response.json();
    const match = body.ongoing.find((a) => a.referenceId?.value === refId);
    console.log('Found activity:', match);
  });

  test('DELETE ongoing appointment', async ({ request }) => {
    const response = await request.delete(
      `/api/healthmanager/v1/appointments/${refId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: 'application/json, text/plain, */*',
          'X-Origin': 'doktor24',
          'Content-Type': 'application/json',
        },
      },
    );
  });
});
