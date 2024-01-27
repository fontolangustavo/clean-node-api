import request from 'supertest'
import { setupApp } from '../config/app'
import { Express } from 'express'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';

let accountCollection: Collection

let app: Express

describe('Login Routes', () => {

  beforeAll(async () => {
    app = await setupApp()
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    accountCollection = MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /signup', () => {
    test('should return 200 on signup', async () => {
      await request(app)
        .post('/api/v1/signup')
        .send({
          name: 'any_name',
          email: 'any_email@gmail.com',
          password: 'any_password',
          passwordConfirmation: 'any_password'
        })
        .expect(200)
    });
  });

  describe('POST /login', () => {
    test('should return 200 on login', async () => {
      const password = await hash('any_password', 12)

      await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password
      })

      await request(app)
        .post('/api/v1/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'any_password'
        })
        .expect(200)
    });

    test('should return 401 on login', async () => {
      await request(app)
        .post('/api/v1/login')
        .send({
          email: 'any_email@gmail.com',
          password: 'any_password'
        })
        .expect(401)
    });
  });
});
