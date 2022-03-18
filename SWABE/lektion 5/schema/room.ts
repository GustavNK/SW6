import {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString
} from 'graphql';


const QueryType = new GraphQLObjectType({
    name:'RootTypeQuery',
    fields:{
        test: {
            type: GraphQLString,
            resolve() {
                return "Hello world"
            }
        }
    }
})


export const schema = new GraphQLSchema({
    query:QueryType,
});
//Resolver functions
