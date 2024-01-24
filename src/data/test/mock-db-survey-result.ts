import { SaveSurveyResultRepository } from "@/data/protocols/db/survey-result/save-survey-result-repository"
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result"
import { SurveyResultModel } from "@/domain/models/survey-result"
import { mockFakeSurveyResult } from "@/domain/test"
import { LoadSurveyResultRepository } from "@/data/protocols/db/survey-result/load-survey-result-repository"

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save(data: SaveSurveyResultParams): Promise<void> {
      await Promise.resolve(mockFakeSurveyResult())
    }
  }

  return new SaveSurveyResultRepositoryStub()
}

export const mockLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(survey_id: string, accountId: string): Promise<SurveyResultModel> {
      return await Promise.resolve(mockFakeSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryStub()
}