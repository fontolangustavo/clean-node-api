import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import { Collection } from 'mongodb';

let surveyCollection: Collection

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
  })

  describe('POST /surveys', () => {
    test('should return 204 on add survey success', async () => {
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
        .expect(204)
    });
  });
});
