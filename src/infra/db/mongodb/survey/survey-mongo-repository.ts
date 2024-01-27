import { ObjectId } from 'mongodb'

import { LoadSurveysRepository } from '@/data/usecases/survey/load-surveys/db-load-surveys.protocols'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'

import { LoadAnswersBySurveyRepository, LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-answers-by-survey.protocols'
import { MongoHelper, QueryBuilder } from '../helpers'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository, LoadAnswersBySurveyRepository {
  async add(data: AddSurveyRepository.Params): Promise<void> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(data)
  }

  async load(accountId: string): Promise<LoadSurveysRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    const query = new QueryBuilder()
      .lookup({
        from: 'surveyResults',
        foreignField: 'surveyId',
        localField: '_id',
        as: 'result'
      })
      .project({
        _id: 1,
        question: 1,
        answers: 1,
        created_at: 1,
        didAnswer: {
          $gte: [
            {
              $size: {
                $filter: {
                  input: '$result',
                  as: 'item',
                  cond: {
                    $eq: ['$$item.accountId', new ObjectId(accountId)]
                  }
                }
              }
            }, 1
          ]
        }
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()

    return MongoHelper.mapCollection(surveys)
  }

  async loadById(id: string): Promise<LoadSurveyByIdRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey && MongoHelper.map(survey)
  }

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    const query = new QueryBuilder()
      .match({
        _id: new ObjectId(id)
      })
      .project({
        _id: 0,
        answers: '$answers.answer'
      })
      .build()

    const surveys = await surveyCollection.aggregate(query).toArray()

    return surveys[0]?.answers || []
  }

  async checkById(id: string): Promise<boolean> {
    const surveyCollection = MongoHelper.getCollection('surveys')

    const survey = await surveyCollection.findOne({ _id: new ObjectId(id) }, {
      projection: {
        _id: 1
      }
    })

    return survey !== null
  }
}
