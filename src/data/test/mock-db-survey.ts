import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository"
import { LoadSurveyByIdRepository, SurveyModel } from "@/data/usecases/load-survey-by-id/db-load-survey-by-id.protocols"
import { mockFakeSurvey, mockFakeSurveys } from "@/domain/test"
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository"

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(data: AddSurveyRepository.Params): Promise<void> {

    }
  }

  return new AddSurveyRepositoryStub()
}

export const mockLoadSurveyByIdRepository = (): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(id: string): Promise<SurveyModel> {
      return Promise.resolve(mockFakeSurvey())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async load(accountId: string): Promise<SurveyModel[]> {
      return Promise.resolve(mockFakeSurveys())
    }
  }

  return new LoadSurveysRepositoryStub()
}
