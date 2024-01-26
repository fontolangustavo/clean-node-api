import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '@/main/config/app'

let app: Express

describe('Content Type Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

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
