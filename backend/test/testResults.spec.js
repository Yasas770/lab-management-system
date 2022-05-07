const request = require('supertest');
const app = require('../app'); // Your Express app
const TestResult = require('../models/testResultModel');
const Appointment = require('../models/appointmentModel');

jest.mock('../models/testResultModel');
jest.mock('../models/appointmentModel');

test('records a new test result successfully', async () => {
    const mockAppointment = { _id: 'appointmentId', patient: 'patientId', test: 'testId', status: 'pending', ... };
    const mockTestResult = { _id: 'testResultId', appointment: 'appointmentId', technician: 'technicianId', result: 'positive', ... };

    Appointment.findById.mockResolvedValue(mockAppointment);
    TestResult.create.mockResolvedValue(mockTestResult);

    const response = await request(app)
        .post('/api/v1/test-results')
        .send({ appointmentId: 'appointmentId', technicianId: 'technicianId', result: 'positive' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Test result recorded successfully');
    expect(response.body.data).toEqual(mockTestResult);
    expect(mockAppointment.status).toBe('completed');
});

test('handles recording test result error when appointment not found', async () => {
    Appointment.findById.mockResolvedValue(null);

    const response = await request(app)
        .post('/api/v1/test-results')
        .send({ appointmentId: 'appointmentId', technicianId: 'technicianId', result: 'positive' });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Appointment not found');
});

test('handles recording test result error', async () => {
    Appointment.findById.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .post('/api/v1/test-results')
        .send({ appointmentId: 'appointmentId', technicianId: 'technicianId', result: 'positive' });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to record test result');
});

test('fetches test results for a specific appointment successfully', async () => {
    const mockTestResults = [{ _id: 'testResultId1', appointment: 'appointmentId', technician: 'technicianId', result: 'positive', ... }, { _id: 'testResultId2', appointment: 'appointmentId', technician: 'technicianId', result: 'negative', ... }];

    TestResult.find.mockResolvedValue(mockTestResults);

    const response = await request(app)
        .get('/api/v1/test-results/appointmentId');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockTestResults);
});

test('handles fetching test results error', async () => {
    TestResult.find.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .get('/api/v1/test-results/appointmentId');

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to fetch test results');
});
