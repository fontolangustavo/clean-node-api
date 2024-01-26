import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '@/main/config/app'

let app: Express

describe('CORS Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('should enable cors', async () => {
    app.get('/test-cors', (req: any, res: any) => {
      res.send()
    })

    await request(app)
      .get('/test-cors')
      .expect('access-control-allow-origin', '*')
  });
});
