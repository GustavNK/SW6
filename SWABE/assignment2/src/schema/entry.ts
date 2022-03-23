import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, printSchema } from 'graphql';
import { pgApiWrapper } from '../db/pg-api';
import MutationType from './mutations';
import QueryType from './queries';

export const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType,
});

