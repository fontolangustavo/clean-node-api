export const surveySchema = {
  type: 'object',
  properties: {

    id: {
      type: 'string',
    },
    question: {
      type: 'string',
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    },
    created_at: {
      type: 'string',
    },
    didAnswer: {
      type: 'boolean'
    }
  },
  required: ['id', 'question', 'answers', 'created_at', 'didAnswer']
}