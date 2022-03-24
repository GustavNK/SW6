import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull
} from 'graphql';

const fieldsWrapper = () => {
    const userFields = {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString)},
        // reservations: {
        //     type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Reservation))),
        //     resolve: (source, args, { loaders, currentUser }) => {
        //         return loaders.reservationsForUser.load()
        //     }
        // }
    };
    return userFields;
};

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => fieldsWrapper(),
});

export type UserType = typeof User

export default User;