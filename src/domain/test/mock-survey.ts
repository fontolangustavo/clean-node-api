import { SurveyModel } from "@/domain/models/survey";
import { AddSurvey } from "@/domain/usecases/survey/add-survey";

export const mockFakeSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_question',
    created_at: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
      {
        image: 'any_image',
        answer: 'other_answer'
      },
    ],
  }
)

export const mockFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any_question',
    created_at: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
    ],
  },
  {
    id: 'any_id',
    question: 'other_question',
    created_at: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'other_answer'
      },
    ],
  }
])

export const mockFakeSurveyParams = (): AddSurvey.Params => ({
  question: 'any_question',
  created_at: new Date(),
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})
