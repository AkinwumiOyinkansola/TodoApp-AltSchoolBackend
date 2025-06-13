const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/userModel');
const Todo = require('../models/todoModel');

describe('Todos', () => {
    let user;
    let authCookie;

    beforeAll(async () => {
        const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp_test';
        await mongoose.connect(url);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
        await Todo.deleteMany({});
        
        // Create and login user
        user = new User({
            username: 'testuser',
            password: 'testpassword' 
        });
        await user.save();
        
        const loginResponse = await request(app)
            .post('/auth/login')
            .send({
                username: 'testuser',
                password: 'testpassword'  
            });
        
        authCookie = loginResponse.headers['set-cookie'];
    });   

    describe('GET /todos', () => {
        it('should get todos for authenticated user', async () => {
            const response = await request(app)
                .get('/todos')
                .set('Cookie', authCookie);
            
            expect(response.status).toBe(200);
            expect(response.text).toContain('My Todos');
        });

        it('should redirect unauthenticated user', async () => {
            const response = await request(app)
                .get('/todos');
            
            expect(response.status).toBe(302);
            expect(response.headers.location).toBe('/auth/login');
        });
    });

    describe('POST /todos', () => {
        it('should create a new todo', async () => {
            const response = await request(app)
                .post('/todos')
                .set('Cookie', authCookie)
                .send({
                    title: 'Test Todo',
                    description: 'Test Description',
                    priority: 'high'
                });
            
            expect(response.status).toBe(302);
            
            const todo = await Todo.findOne({ title: 'Test Todo' });
            expect(todo).toBeTruthy();
            expect(todo.userId.toString()).toBe(user._id.toString());
        });

        it('should not create todo without title', async () => {
            const response = await request(app)
                .post('/todos')
                .set('Cookie', authCookie)
                .send({
                    description: 'Test Description'
                });
            
            expect(response.status).toBe(200);
            expect(response.text).toContain('Todo title is required');
        });
    });
});