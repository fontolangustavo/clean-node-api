import { LoadSurveyByIdRepository, SurveyModel, LoadSurveyById } from "./db-load-survey-by-id.protocols";

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) { }

  async load(id: string): Promise<SurveyModel> {
    const survey = await this.loadSurveyByIdRepository.load(id)

    return Promise.resolve(survey)
  }
}