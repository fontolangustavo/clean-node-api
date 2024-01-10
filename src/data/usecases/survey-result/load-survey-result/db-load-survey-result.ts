import {
  LoadSurveyResultRepository,
  SurveyResultModel,
  LoadSurveyResult,
  LoadSurveyByIdRepository
} from './db-load-survey-result.protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor(
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load(surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)

    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)
      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        created_at: survey.created_at,
        answers: survey.answers.map((item) => Object.assign({}, item, {
          count: 0,
          percent: 0
        }))
      }
    }

    return surveyResult
  }
} 