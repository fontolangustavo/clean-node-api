import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection, ObjectId } from 'mongodb';
import { sign } from 'jsonwebtoken';
import env from '../config/env';

let surveyCollection: Collection
let accountCollection: Collection

describe('Surey Routes', () => {

  beforeAll(async () => {
    await MongoHelper.connect(process.env.MONGO_URL ?? '')
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    surveyCollection = await MongoHelper.getCollection('surveys')
    await surveyCollection.deleteMany({})

    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  describe('POST /surveys', () => {
    test('should return 403 on add survey without accessToken', async () => {
      await request(app)
        .post('/api/v1/surveys')
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'any_answer_2'
            }
          ]
        })
        .expect(403)
    });

    test('should return 204 on add survey with valid accessToken', async () => {
      const res = await accountCollection.insertOne({
        name: 'any_name',
        email: 'any_email@gmail.com',
        password: 'any_password',
        role: 'admin'
      })

      const id = res.insertedId.toString()
      const accessToken = sign({ id }, env.jwtSecret)

      await accountCollection.updateOne({
        _id: new ObjectId(id)
      }, {
        $set: {
          accessToken
        }
      })

      await request(app)
        .post('/api/v1/surveys')
        .set('x-access-token', accessToken)
        .send({
          question: 'any_question',
          answers: [
            {
              image: 'any_image',
              answer: 'any_answer'
            },
            {
              answer: 'any_answer_2'
            }
          ]
        })
        .expect(204)
    });
  });

  describe('GET /surveys', () => {
    test('should return 403 on load survey without accessToken', async () => {
      await request(app)
        .get('/api/v1/surveys')
        .expect(403)
    });
  });
});
