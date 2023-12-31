import { SaveSurveyResultParams, SaveSurveyResultRepository, SurveyResultModel } from "@/data/usecases/survey-result/save-survey-result/db-save-survey-result.protocols";
import { MongoHelper } from "../helpers/mongo-helper";

export class SurveyResultMongoRepository implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyCollection = await MongoHelper.getCollection('surveyResults')

    const res = await surveyCollection.findOneAndUpdate({
      surveyId: data.surveyId,
      accountId: data.accountId,
    }, {
      $set: {
        answer: data.answer,
        created_at: data.created_at
      }
    }, {
      upsert: true,
      returnDocument: 'after'
    })

    const survey = await surveyCollection.findOne<SurveyResultModel>({ _id: res.value._id })
    return MongoHelper.map(survey)
  }
}