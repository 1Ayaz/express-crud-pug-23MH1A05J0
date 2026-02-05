const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/app');
const Student = require('../src/models/Student');

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.disconnect(); // Ensure we are not connected to real DB
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

afterEach(async () => {
    await Student.deleteMany({});
});

describe('Student CRUD API', () => {
    test('GET / should render index with empty students', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('No students found');
    });

    test('POST /create should create a new student', async () => {
        const studentData = {
            name: 'John Doe',
            rollNumber: 'S001',
            email: 'john@example.com',
            course: 'Computer Science'
        };
        const response = await request(app)
            .post('/create')
            .send(new URLSearchParams(studentData).toString())
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(302); // Redirect
        expect(response.header.location).toBe('/');

        const student = await Student.findOne({ rollNumber: 'S001' });
        expect(student).toBeTruthy();
        expect(student.name).toBe('John Doe');
    });

    test('POST /create should fail with missing data', async () => {
        const response = await request(app)
            .post('/create')
            .send('name=John')
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(400);
        expect(response.text).toContain('Roll number is required');
    });

    test('GET /edit/:id should render edit form', async () => {
        const student = await Student.create({
            name: 'Jane Doe',
            rollNumber: 'S002',
            email: 'jane@example.com',
            course: 'Engineering'
        });

        const response = await request(app).get(`/edit/${student._id}`);
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Jane Doe');
    });

    test('GET /edit/:id should return 404 for invalid id', async () => {
        const id = new mongoose.Types.ObjectId();
        const response = await request(app).get(`/edit/${id}`);
        expect(response.statusCode).toBe(404);
    });

    test('POST /edit/:id should update student', async () => {
        const student = await Student.create({
            name: 'Jane Doe',
            rollNumber: 'S002',
            email: 'jane@example.com',
            course: 'Engineering'
        });

        const response = await request(app)
            .post(`/edit/${student._id}`)
            .send('name=Jane Smith&rollNumber=S002&email=jane@example.com&course=Physics')
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(302);

        const updatedStudent = await Student.findById(student._id);
        expect(updatedStudent.name).toBe('Jane Smith');
        expect(updatedStudent.course).toBe('Physics');
    });

    test('POST /edit/:id should fail with validation error', async () => {
        const student = await Student.create({
            name: 'Jane Doe',
            rollNumber: 'S002',
            email: 'jane@example.com',
            course: 'Engineering'
        });

        const response = await request(app)
            .post(`/edit/${student._id}`)
            .send('name=&rollNumber=S002&email=jane@example.com&course=Physics')
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(400);
        expect(response.text).toContain('Student name is required');
    });

    test('POST /delete/:id should delete student', async () => {
        const student = await Student.create({
            name: 'Delete Me',
            rollNumber: 'D001',
            email: 'delete@example.com',
            course: 'None'
        });

        const response = await request(app)
            .post(`/delete/${student._id}`);

        expect(response.statusCode).toBe(302);
        const deletedStudent = await Student.findById(student._id);
        expect(deletedStudent).toBeNull();
    });

    test('GET /create should render create form', async () => {
        const response = await request(app).get('/create');
        expect(response.statusCode).toBe(200);
        expect(response.text).toContain('Add New Student');
    });

    test('POST /create should fail if rollNumber is duplicate', async () => {
        await Student.create({
            name: 'John Doe',
            rollNumber: 'S001',
            email: 'john@example.com',
            course: 'CS'
        });

        const response = await request(app)
            .post('/create')
            .send('name=John Smith&rollNumber=S001&email=john2@example.com&course=CS')
            .set('Content-Type', 'application/x-www-form-urlencoded');

        expect(response.statusCode).toBe(400);
        expect(response.text).toContain('E11000 duplicate key error');
    });

    test('GET / should handle list errors', async () => {
        jest.spyOn(Student, 'find').mockImplementationOnce(() => ({
            sort: jest.fn().mockImplementationOnce(() => {
                throw new Error('Database Error');
            })
        }));
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(500);
        expect(response.text).toBe('Database Error');
    });

    test('GET /edit/:id should handle find errors', async () => {
        jest.spyOn(Student, 'findById').mockImplementationOnce(() => {
            throw new Error('Find Error');
        });
        const response = await request(app).get(`/edit/${new mongoose.Types.ObjectId()}`);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Find Error');
    });

    test('POST /delete/:id should handle delete errors', async () => {
        jest.spyOn(Student, 'findByIdAndDelete').mockImplementationOnce(() => {
            throw new Error('Delete Error');
        });
        const response = await request(app).post(`/delete/${new mongoose.Types.ObjectId()}`);
        expect(response.statusCode).toBe(400);
        expect(response.text).toBe('Delete Error');
    });

    test('GET /unknown should return 404', async () => {
        const response = await request(app).get('/unknown');
        expect(response.statusCode).toBe(404);
        expect(response.text).toBe('Page Not Found');
    });
});
