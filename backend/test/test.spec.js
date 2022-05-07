const request = require('supertest');
const app = require('../app'); // Your Express app
const Patient = require('../models/patientModel');
const Doctor = require('../models/doctorModel');
const Test = require('../models/testModel');
const Timeslot = require('../models/timeslotModel');
const Appointment = require('../models/appointmentModel');

jest.mock('../models/patientModel');
jest.mock('../models/doctorModel');
jest.mock('../models/testModel');
jest.mock('../models/timeslotModel');
jest.mock('../models/appointmentModel');

test('creates a new appointment successfully', async () => {
    const mockPatient = { _id: 'patientId', name: 'John Doe', ... };
    const mockDoctor = { _id: 'doctorId', name: 'Dr. Smith', ... };
    const mockTest = { _id: 'testId', name: 'Blood Test', ... };
    const mockTimeslot = { _id: 'timeslotId', time: '10:00', ... };
    const mockAppointment = { _id: 'appointmentId', patient: 'patientId', doctor: 'doctorId', test: 'testId', timeslot: 'timeslotId', ... };

    Patient.findById.mockResolvedValue(mockPatient);
    Doctor.findById.mockResolvedValue(mockDoctor);
    Test.findById.mockResolvedValue(mockTest);
    Timeslot.findById.mockResolvedValue(mockTimeslot);
    Appointment.create.mockResolvedValue(mockAppointment);

    const response = await request(app)
        .post('/api/v1/appointments')
        .send({ patientId: 'patientId', doctorId: 'doctorId', testId: 'testId', timeslotId: 'timeslotId' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Appointment created successfully');
    expect(response.body.data).toEqual(mockAppointment);
});

test('handles creation error when patient, doctor, or test not found', async () => {
    Patient.findById.mockResolvedValue(null);
    Doctor.findById.mockResolvedValue(null);
    Test.findById.mockResolvedValue(null);

    const response = await request(app)
        .post('/api/v1/appointments')
        .send({ patientId: 'patientId', doctorId: 'doctorId', testId: 'testId', timeslotId: 'timeslotId' });

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Patient, doctor, or test not found');
});

test('handles creation error when appointment creation fails', async () => {
    const mockPatient = { _id: 'patientId', name: 'John Doe', ... };
    const mockDoctor = { _id: 'doctorId', name: 'Dr. Smith', ... };
    const mockTest = { _id: 'testId', name: 'Blood Test', ... };
    const mockTimeslot = { _id: 'timeslotId', time: '10:00', ... };

    Patient.findById.mockResolvedValue(mockPatient);
    Doctor.findById.mockResolvedValue(mockDoctor);
    Test.findById.mockResolvedValue(mockTest);
    Timeslot.findById.mockResolvedValue(mockTimeslot);
    Appointment.create.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .post('/api/v1/appointments')
        .send({ patientId: 'patientId', doctorId: 'doctorId', testId: 'testId', timeslotId: 'timeslotId' });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to create appointment');
}); 