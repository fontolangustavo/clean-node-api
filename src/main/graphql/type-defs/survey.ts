import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    surveys: [Survey!]! @auth
  }

  type Survey {
    id: ID!
    question: String!
    answers: [SurveyAnswer!]!
    didAnswer: Boolean
    created_at: DateTime!
  }

  type SurveyAnswer {
    image: String
    answer: String!
  }
`