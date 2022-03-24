
import { GraphQLID, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, printSchema } from 'graphql';
import { resolve } from 'path';
import User from './types/user';

const QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        currentTime: {
            type: GraphQLString,
            resolve: () => {
                const isoString = new Date().toISOString();
                return isoString.slice(11, 19);
            },
        },
        UserInfo: {
            type: GraphQLInt,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (source, args , { loaders }) => {
                console.log(source, "SOURCE");
                console.log(args, "ARGS");
                console.log(loaders, "CONTEXT");
                return await loaders.userInfo.load(args.id)
            }
        },
        getAllUsers:{
            type: new GraphQLList(new GraphQLNonNull(User)),
            resolve: async (source, args, {pgApi}) => {
                return await pgApi.queries.getAllUsers();
            }
        },

        name: {
            type: GraphQLString,
            resolve() {

            }
        },
        // me: {
        //     type: Me,
        //     resolve: async (source, args, { currentUser }) => {
        //       return currentUser;
        //     },
        // },
    },
})

export default QueryType;