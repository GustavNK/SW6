
import { GraphQLID, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString, printSchema } from 'graphql';

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
        Users: {
            type: GraphQLID,
            resolve: async (source, userid , context) => {
                console.log(source, userid, context);
                return await context.loaders.users(userid)
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