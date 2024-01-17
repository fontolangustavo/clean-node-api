import { SurveyResultModel } from "@/domain/models/survey-result";
import { SaveSurveyResultParams } from "@/domain/usecases/survey-result/save-survey-result";

export const mockFakeSurveyResult = (): SurveyResultModel => ({
  surveyId: 'any_id',
  question: 'any_question',
  answers: [
    {
      answer: 'any_answer',
      image: 'any_image',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    },
    {
      answer: 'other_answer',
      image: 'any_image',
      count: 0,
      percent: 0,
      isCurrentAccountAnswer: false
    }
  ],
  created_at: new Date()
})

export const mockFakeSurveyResultData = (): SaveSurveyResultParams => ({
  surveyId: 'any_id',
  accountId: 'any_account_id',
  answer: 'any_answer',
  created_at: new Date()
})
