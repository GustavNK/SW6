import {
    GraphQLInputObjectType,
    GraphQLString,
    GraphQLNonNull,
  } from 'graphql';
  
  export const UserInput = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
      username: { type: new GraphQLNonNull(GraphQLString) },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
    }),
  });
  export type UserInputType = typeof UserInput;
  