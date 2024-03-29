import { gql } from "apollo-server-express";

export default gql`
  extend type Query {
    surveyResult(surveyId: String!): SurveyResult! @auth
  }

  extend type Mutation {
    saveSurveyResult(surveyId: String!, answer: String!): SurveyResult! @auth
  }

  type SurveyAnswer {
    image: String
    answer: String!
    count: Int!
    percent: Int!
    isCurrentAccountAnswer: Boolean!
  }

  type SurveyResult {
    surveyId: String!
    question: String!
    answers: [SurveyAnswer!]!,
    created_at: DateTime!
  }
`