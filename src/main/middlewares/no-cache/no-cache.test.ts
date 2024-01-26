import request from 'supertest'
import { Express } from 'express'
import { setupApp } from '@/main/config/app'

import { noCache } from '.';

let app: Express

describe('NoCache Middleware', () => {
  beforeAll(async () => {
    app = await setupApp()
  })

  test('should disable cache', async () => {
    app.get('/test-no-cache', noCache, (req: any, res: any) => {
      res.send()
    })

    await request(app)
      .get('/test-no-cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidade, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  });
});
