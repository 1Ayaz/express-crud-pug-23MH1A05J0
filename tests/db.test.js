const mongoose = require('mongoose');
const connectDB = require('../src/config/db');

describe('Database Connection', () => {
    let exitSpy;

    beforeEach(() => {
        exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { });
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('should connect to database successfully with default URI', async () => {
        const originalUri = process.env.MONGODB_URI;
        delete process.env.MONGODB_URI;

        jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({
            connection: { host: 'localhost' }
        });

        await connectDB();
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://localhost:27017/express-crud-pug');

        process.env.MONGODB_URI = originalUri;
    });

    test('should connect to database successfully with MONGODB_URI', async () => {
        const originalUri = process.env.MONGODB_URI;
        process.env.MONGODB_URI = 'mongodb://atlas:27017/test';

        jest.spyOn(mongoose, 'connect').mockResolvedValueOnce({
            connection: { host: 'atlas' }
        });

        await connectDB();
        expect(mongoose.connect).toHaveBeenCalledWith('mongodb://atlas:27017/test');

        process.env.MONGODB_URI = originalUri;
    });

    test('should exit if connection fails', async () => {
        jest.spyOn(mongoose, 'connect').mockRejectedValueOnce(new Error('Connection Failed'));

        await connectDB();
        expect(mongoose.connect).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error: Connection Failed'));
        expect(exitSpy).toHaveBeenCalledWith(1);
    });
});
