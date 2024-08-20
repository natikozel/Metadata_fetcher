const request = require('supertest');
const app = require('../../app');

jest.mock('csurf', () => {
    return jest.fn(() => (req, res, next) => {
        req.csrfToken = () => 'mocked-csrf-token';
        next();
    });
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

describe('App Tests', () => {

    afterEach(async () => {
        await sleep(250);
    });

    test('should handle multiple URLs', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({urls: ['https://www.youtube.com/', 'https://github.com/']})
            .withCredentials(true);
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    test('should return error for invalid URL format', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({urls: ['invalid-url']});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid URL(s)');
    });

    test('should handle large number of URLs', async () => {
        const urls = Array(9).fill('https://github.com');
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({urls});
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(9);
    });

    test('should return error for missing URLs field', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({urls: []})
            .withCredentials(true);
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Please provide at least one URL');
    });

    test('should handle rate limiting', async () => {
        for (let i = 0; i < 10; i++) {
            await request(app)
                .post('/fetch-metadata')
                .set('X-CSRF-Token', 'mocked-csrf-token')
                .send({urls: ['https://github.com']});
        }
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({urls: ['https://github.com']});
        expect(response.status).toBe(429);
    });

    test('should return error for non-array URLs field', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({ urls: 'https://github.com' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Please provide an array of URLs');
    });

    test('should handle mixed valid and invalid URLs', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({ urls: ['https://github.com', 'invalid-url'] });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Invalid URL(s)');
    });

    test('should handle empty request body', async () => {
        const response = await request(app)
            .post('/fetch-metadata')
            .set('X-CSRF-Token', 'mocked-csrf-token')
            .send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Please provide an array of URLs');
    });

});