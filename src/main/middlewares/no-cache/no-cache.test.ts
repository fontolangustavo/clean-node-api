import request from 'supertest'
import app from '../../config/app'
import { noCache } from '.';

describe('NoCache Middleware', () => {
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
