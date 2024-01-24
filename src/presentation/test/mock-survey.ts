import { AddSurvey } from '@/domain/usecases/survey/add-survey'
import { LoadSurveyById } from '@/domain/usecases/survey/load-survey-by-id'
import { CheckSurveyById } from '@/domain/usecases/survey/check-survey-by-id'
import { LoadSurveys } from '@/domain/usecases/survey/load-surveys'
import { SaveSurveyResult, SaveSurveyResultParams } from '@/domain/usecases/survey-result/save-survey-result'
import { SurveyModel } from '@/domain/models/survey'
import { SurveyResultModel } from '@/domain/models/survey-result'
import { mockFakeSurvey, mockFakeSurveyResult, mockFakeSurveys } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usecases/survey-result/load-survey-result'

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurvey.Params): Promise<void> {
      return await Promise.resolve()
    }
  }

  return new AddSurveyStub()
}

export const mockLoadSurveys = (): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(accountId: string): Promise<SurveyModel[]> {
      return await Promise.resolve(mockFakeSurveys())
    }
  }

  return new LoadSurveysStub()
}

export const mockLoadSurveyById = (): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return await Promise.resolve(mockFakeSurvey())
    }
  }

  return new LoadSurveyByIdStub()
}

export const mockCheckSurveyById = (): CheckSurveyById => {
  class CheckSurveyByIdStub implements CheckSurveyById {
    async checkById(id: string): Promise<CheckSurveyById.Result> {
      return await Promise.resolve(true)
    }
  }

  return new CheckSurveyByIdStub()
}

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return await Promise.resolve(mockFakeSurveyResult())
    }
  }

  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(surveyId: string, accountId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockFakeSurveyResult())
    }
  }

  return new LoadSurveyResultStub()
}
