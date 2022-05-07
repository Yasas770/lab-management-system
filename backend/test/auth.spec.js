const request = require('supertest');
const app = require('../app'); // Your Express app
const Patient = require('../models/patientModel');
const Technician = require('../models/technicianModel');
const Doctor = require('../models/doctorModel');
const Admin = require('../models/adminModel');

jest.mock('../models/patientModel');
jest.mock('../models/technicianModel');
jest.mock('../models/doctorModel');
jest.mock('../models/adminModel');

test('registers a new patient successfully', async () => {
    const mockPatient = { _id: 'patientId', name: 'John Doe', email: 'john@example.com', ... };
    Patient.create.mockResolvedValue(mockPatient);

    const response = await request(app)
        .post('/api/v1/register/patient')
        .send({ name: 'John Doe', email: 'john@example.com', password: 'password' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Patient registered successfully');
    expect(response.body.data).toEqual(mockPatient);
});

// Similarly, you can write test cases for registerTechnician, registerDoctor, and registerAdmin

test('logs in user successfully', async () => {
    const mockUser = { _id: 'userId', name: 'John Doe', email: 'john@example.com', password: 'hashedPassword', role: 'patient', ... };
    Patient.findOne.mockResolvedValue(mockUser);
    mockUser.matchPassword = jest.fn().mockResolvedValue(true);

    const response = await request(app)
        .post('/api/v1/login')
        .send({ email: 'john@example.com', password: 'password' });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('john@example.com');
    expect(response.body.role).toBe('patient');
    expect(response.body).toHaveProperty('token');
});

test('handles login failure with invalid email', async () => {
    Patient.findOne.mockResolvedValue(null);

    const response = await request(app)
        .post('/api/v1/login')
        .send({ email: 'invalid@example.com', password: 'password' });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid email or password');
});

test('handles login failure with invalid password', async () => {
    const mockUser = { _id: 'userId', name: 'John Doe', email: 'john@example.com', password: 'hashedPassword', ... };
    Patient.findOne.mockResolvedValue(mockUser);
    mockUser.matchPassword = jest.fn().mockResolvedValue(false);

    const response = await request(app)
        .post('/api/v1/login')
        .send({ email: 'john@example.com', password: 'wrongPassword' });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Invalid email or password');
});
