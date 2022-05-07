const request = require('supertest');
const app = require('../app'); // Your Express app
const Timeslot = require('../models/timeslotModel');

jest.mock('../models/timeslotModel');

test('creates a new timeslot successfully', async () => {
    const mockTimeslot = { _id: 'timeslotId', test: 'testId', startTime: '10:00', endTime: '11:00', ... };
    Timeslot.create.mockResolvedValue(mockTimeslot);

    const response = await request(app)
        .post('/api/v1/timeslots')
        .send({ test: 'testId', startTime: '10:00', endTime: '11:00' });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Timeslot created successfully');
    expect(response.body.data).toEqual(mockTimeslot);
});

test('handles timeslot creation error', async () => {
    Timeslot.create.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .post('/api/v1/timeslots')
        .send({ test: 'testId', startTime: '10:00', endTime: '11:00' });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to create timeslot');
});

test('fetches timeslots for a specific test successfully', async () => {
    const mockTimeslots = [{ _id: 'timeslotId1', test: 'testId', startTime: '10:00', endTime: '11:00', ... }, { _id: 'timeslotId2', test: 'testId', startTime: '12:00', endTime: '13:00', ... }];

    Timeslot.find.mockResolvedValue(mockTimeslots);

    const response = await request(app)
        .get('/api/v1/timeslots/testId');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockTimeslots);
});

test('handles timeslot fetching error', async () => {
    Timeslot.find.mockRejectedValue(new Error('Database Error'));

    const response = await request(app)
        .get('/api/v1/timeslots/testId');

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Failed to fetch timeslots');
});
