import { mockFakeSurveyResult } from "@/domain/test";
import { SurveyResultModel } from "../save-survey-result/db-save-survey-result.protocols";
import { LoadSurveyResultRepository } from '@/data/protocols/db/survey-result/load-survey-result-repository'
import { DbLoadSurveyResult } from "./db-load-survey-result";

const makeLoadSurveyResultRepositoryStub = (): LoadSurveyResultRepository => {
  class LoadSurveyResultRepositoryStub implements LoadSurveyResultRepository {
    async loadBySurveyId(survey_id: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockFakeSurveyResult())
    }
  }

  return new LoadSurveyResultRepositoryStub()
}

type SutType = {
  sut: DbLoadSurveyResult
  loadSurveyResultRepositoryStub: LoadSurveyResultRepository
}

const makeSut = (): SutType => {
  const loadSurveyResultRepositoryStub = makeLoadSurveyResultRepositoryStub()
  const sut = new DbLoadSurveyResult(loadSurveyResultRepositoryStub)

  return {
    sut,
    loadSurveyResultRepositoryStub
  }
}

describe('DbLoadSurveyResult Usecase', () => {
  test('should call LoadSurveyResultRepository', async () => {

    const { sut, loadSurveyResultRepositoryStub } = makeSut()

    const loadBySurveyIdSpy = jest.spyOn(loadSurveyResultRepositoryStub, 'loadBySurveyId')

    await sut.load('any_survey_id')

    expect(loadBySurveyIdSpy).toHaveBeenCalledWith('any_survey_id')
  });
});