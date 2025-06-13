const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');

describe('Authentication', () => {
    beforeAll(async () => {
        const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp_test';
        await mongoose.connect(url);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    }); 

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'testuser',
                    password: 'testpassword',
                    confirmPassword: 'testpassword'
                });
            
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe('/todos');
            
            const user = await User.findOne({ username: 'testuser' });
            expect(user).toBeTruthy();
        });

        it('should not register user with invalid data', async () => {
            const response = await request(app)
                .post('/auth/register')
                .send({
                    username: 'te',
                    password: '123',
                    confirmPassword: '456'
                });
            
            expect(response.status).toBe(200);
            expect(response.text).toContain('Username must be between 3 and 30 characters');
        });
    });

    describe('POST /auth/login', () => {
        beforeEach(async () => {
            const user = new User({
                username: 'testuser',
                password: 'testpassword'
            });
            await user.save();
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'testpassword'
                });
            
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe('/todos');
        });

        it('should not login with invalid credentials', async () => {
            const response = await request(app)
                .post('/auth/login')
                .send({
                    username: 'testuser',
                    password: 'wrongpassword'
                });
            
            expect(response.status).toBe(200);
            expect(response.text).toContain('Invalid username or password');
        });
    });
});