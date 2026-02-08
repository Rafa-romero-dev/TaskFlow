/**
 * @jest-environment node
 */
import { GET as getTasks, POST as createTask } from '@/app/api/tasks/route';
import { PUT as updateTask, DELETE as deleteTask } from '@/app/api/tasks/[id]/route';
import { POST as loginUser } from '@/app/api/auth/login/route';

describe('API Integration Tests', () => {
    const baseUrl = 'http://localhost:3000/api';

    describe('/api/auth/login', () => {
        it('should return 200 and a token for valid credentials', async () => {
            const request = new Request(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: '123pass456' }),
            });
            const response = await loginUser(request);
            expect(response.status).toBe(200);

            // Check for cookie
            const cookie = response.headers.get('set-cookie');
            expect(cookie).toContain('session_token=fake-jwt-token');

            const data = await response.json();
            expect(data).toHaveProperty('token');
            expect(data.user).toHaveProperty('email', 'test@example.com');
        });

        it('should return 401 for invalid credentials', async () => {
            const request = new Request(`${baseUrl}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@example.com', password: 'wrongpassword' }),
            });
            const response = await loginUser(request);
            expect(response.status).toBe(401);
        });
    });

    describe('/api/tasks', () => {
        let createdTaskId;

        it('should return empty list initially', async () => {
            const request = new Request(`${baseUrl}/tasks`, { method: 'GET' });
            const response = await getTasks(request);
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(Array.isArray(data)).toBe(true);
            expect(data.length).toBe(0);
        });

        it('should create a new task with default status', async () => {
            const taskData = { title: 'Test Task', description: 'Testing API' };
            const request = new Request(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            const response = await createTask(request);
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data).toHaveProperty('id');
            expect(data.title).toBe(taskData.title);
            expect(data.status).toBe('todo'); // Updated to new default status
            createdTaskId = data.id;
        });

        it('should create a task with specific status', async () => {
            const taskData = { title: 'In Progress Task', description: 'Testing status', status: 'in-progress' };
            const request = new Request(`${baseUrl}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData),
            });
            const response = await createTask(request);
            expect(response.status).toBe(201);
            const data = await response.json();
            expect(data.status).toBe('in-progress');
        });

        it('should get the list with the created task', async () => {
            const request = new Request(`${baseUrl}/tasks`, { method: 'GET' });
            const response = await getTasks(request);
            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.length).toBeGreaterThan(0);
            expect(data.some(task => task.id === createdTaskId)).toBe(true);
        });

        it('should update the task status', async () => {
            const updateData = { status: 'done' }; // Updated to new status value
            const request = new Request(`${baseUrl}/tasks/${createdTaskId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData),
            });

            // Mock params object
            const context = { params: { id: createdTaskId } };

            // Need async context for Next.js 15 usually, but let's try direct object first 
            // Actually Next.js 15 might require awaiting params if it's dynamic path, but for unit test of handler:
            // handler(req, { params })
            const response = await updateTask(request, context);

            expect(response.status).toBe(200);
            const data = await response.json();
            expect(data.status).toBe('done'); // Updated to new status value
        });

        it('should delete the task', async () => {
            const request = new Request(`${baseUrl}/tasks/${createdTaskId}`, {
                method: 'DELETE',
            });
            const context = { params: { id: createdTaskId } };
            const response = await deleteTask(request, context);

            expect(response.status).toBe(204); // or 200 with message

            // Verify deletion
            const getReq = new Request(`${baseUrl}/tasks`, { method: 'GET' });
            const getRes = await getTasks(getReq);
            const data = await getRes.json();
            expect(data.some(task => task.id === createdTaskId)).toBe(false);
        });
    });
});
