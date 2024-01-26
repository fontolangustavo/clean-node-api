import { ApolloServer, ExpressContext } from "apollo-server-express";

import resolvers from "../resolvers";
import typeDefs from "../type-defs";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { authDirectiveTransformer } from "../directives";

let schema = makeExecutableSchema({ resolvers, typeDefs })
schema = authDirectiveTransformer(schema)

export const makeApolloServer = (): ApolloServer<ExpressContext> => (
  new ApolloServer({
    resolvers,
    typeDefs,
    context: ({ req }) => ({ req })
  })
)
