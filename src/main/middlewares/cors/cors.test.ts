import request from 'supertest'
import app from '../../config/app'

describe('CORS Middleware', () => {
  test('should enable cors', async () => {
    app.get('/test-cors', (req: any, res: any) => {
      res.send()
    })

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
  });
});
