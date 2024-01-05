export const surveyResultSchema = {
  type: 'object',
  properties: {
    surveyId: {
      type: 'string',
    },
    question: {
      type: 'string',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyResultAnswer'
      }
    },
    created_at: {
      type: 'string',
    },
  },
  required: ['surveyId', 'question, answers', 'created_at']
}
