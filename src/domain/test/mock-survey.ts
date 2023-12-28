import { SurveyModel } from "@/domain/models/survey";
import { AddSurveyParams } from "@/domain/usecases/survey/add-survey";

export const mockFakeSurvey = (): SurveyModel => (
  {
    id: 'any_id',
    question: 'any_questions',
    created_at: new Date(),
    answers: [
      {
        image: 'any_image',
        answer: 'any_answer'
      },
    ],
  }
)

export const mockFakeSurveys = (): SurveyModel[] => ([
  {
    id: 'any_id',
    question: 'any_questions',
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
    question: 'other_questions',
    created_at: new Date(),
    answers: [
      {
        image: 'other_image',
        answer: 'other_answer'
      },
    ],
  }
])

export const mockFakeSurveyParams = (): AddSurveyParams => ({
  question: 'any_question',
  created_at: new Date(),
  answers: [{
    image: 'any_image',
    answer: 'any_answer'
  }]
})
