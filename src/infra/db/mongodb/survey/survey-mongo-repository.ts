import { LoadSurveysRepository, SurveyModel } from '@/data/usecases/load-surveys/db-load-surveys.protocols'
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository'
import { AddSurveyModel } from '@/domain/usecases/add-survey'
import { MongoHelper } from '../helpers/mongo-helper'
import { LoadSurveyByIdRepository } from '@/data/usecases/load-survey-by-id/db-load-survey-by-id.protocols'
import { ObjectId } from 'mongodb'

export class SurveyMongoRepository implements AddSurveyRepository, LoadSurveysRepository, LoadSurveyByIdRepository {
  async add(data: AddSurveyModel): Promise<void> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    await surveyCollection.insertOne(data)
  }

  async load(): Promise<SurveyModel[]> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    /* @ts-ignore */
    const surveys: SurveyModel[] = await surveyCollection.find().toArray()

    return surveys
  }


  async loadById(id: string): Promise<SurveyModel> {
    const surveyCollection = await MongoHelper.getCollection('surveys')

    /* @ts-ignore */
    const survey: SurveyModel = await surveyCollection.findOne({ _id: new ObjectId(id) })

    return survey
  }
}
