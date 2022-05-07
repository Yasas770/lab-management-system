const request = require('supertest');
const app = require('../app'); // Your Express app
const Doctor = require('../models/doctorModel');
const Patient = require('../models/patientModel');

jest.mock('../models/doctorModel');
jest.mock('../models/patientModel');

test('fetches all doctors successfully', async () => {
    const mockDoctors = [{ _id: 'doctorId1', name: 'Dr. Smith', ... }, { _id: 'doctorId2', name: 'Dr. Johnson', ... }];

    Doctor.find.mockResolvedValue(mockDoctors);

    const response = await request(app)
        .get('/api/v1/doctors');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockDoctors);
});

test('handles doctor fetching error', async () => {
    Doctor.find.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .get('/api/v1/doctors');

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to fetch doctors');
});

test('fetches all patients successfully', async () => {
    const mockPatients = [{ _id: 'patientId1', name: 'John Doe', ... }, { _id: 'patientId2', name: 'Jane Smith', ... }];

    Patient.find.mockResolvedValue(mockPatients);

    const response = await request(app)
        .get('/api/v1/patients');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockPatients);
});

test('handles patient fetching error', async () => {
    Patient.find.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .get('/api/v1/patients');

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to fetch patients');
});
