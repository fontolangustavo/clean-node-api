import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '@/main/config/app'

let app: Express

describe('Body Parser Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })
  test('should parse body as json', async () => {
    app.post('/test-body-parser', (req: any, res: any) => {
      res.send(req.body)
    })

    await request(app)
      .post('/test-body-parser')
      .send({ name: 'any_name' })
      .expect({ name: 'any_name' })
  });
});
