import {
  SaveSurveyResultRepository,
  LoadSurveyResultRepository,
  SaveSurveyResult,
  SaveSurveyResultParams,
  SurveyResultModel
} from "./db-save-survey-result.protocols";

export class DbSaveSurveyResult implements SaveSurveyResult {
  constructor(
    private readonly saveSurveyResultRepository: SaveSurveyResultRepository,
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository
  ) { }

  async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const survey = await this.saveSurveyResultRepository.save(data)

    return await this.loadSurveyResultRepository.loadBySurveyId(survey.surveyId)
  }
}