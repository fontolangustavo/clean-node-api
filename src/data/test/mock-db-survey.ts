import { AddSurveyRepository } from "@/data/protocols/db/survey/add-survey-repository"
import { LoadAnswersBySurveyRepository, LoadSurveyByIdRepository, SurveyModel } from "@/data/usecases/load-survey-by-id/db-load-answers-by-survey.protocols"
import { mockFakeSurvey, mockFakeSurveys } from "@/domain/test"
import { LoadSurveysRepository } from "../protocols/db/survey/load-surveys-repository"
import { CheckSurveyByIdRepository } from "../protocols/db/survey/check-survey-by-id-repository"

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
      return await Promise.resolve(mockFakeSurvey())
    }
  }

  return new LoadSurveyByIdRepositoryStub()
}

export const mockLoadAnswersBySurveyRepository = (): LoadAnswersBySurveyRepository => {
  class LoadAnswersBySurveyRepositoryStub implements LoadAnswersBySurveyRepository {
    async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Result> {
      return await Promise.resolve(mockFakeSurvey().answers.map(item => item.answer))
    }
  }

  return new LoadAnswersBySurveyRepositoryStub()
}

export const mockCheckSurveyByIdRepository = (): CheckSurveyByIdRepository => {
  class CheckSurveyByIdRepositoryStub implements CheckSurveyByIdRepository {
    async checkById(id: string): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }

  return new CheckSurveyByIdRepositoryStub()
}

export const mockLoadSurveysRepository = (): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async load(accountId: string): Promise<SurveyModel[]> {
      return await Promise.resolve(mockFakeSurveys())
    }
  }

  return new LoadSurveysRepositoryStub()
}
