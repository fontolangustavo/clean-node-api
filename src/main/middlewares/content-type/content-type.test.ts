import request from 'supertest'
import app from '../../config/app'

describe('Content Type Middleware', () => {
  test('should return default content type as json', async () => {
    app.get('/test-content-type/json', (req: any, res: any) => {
      res.send()
    })

    await request(app)
      .get('/test-content-type/json')
      .expect('content-type', /json/)
  });

  test('should return xml content type when forced', async () => {
    app.get('/test-content-type/xml', (req: any, res: any) => {
      res.type('xml')
      res.send()
    })

    await request(app)
      .get('/test-content-type/xml')
      .expect('content-type', /xml/)
  });
});
