import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
    GraphQLInputObjectType
} from 'graphql';
import Reservation from './reservation';

const fieldsWrapper = () => {
    const userFields = {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        name: { type: new GraphQLNonNull(GraphQLString)},
        reservations: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Reservation))),
            resolve: (source, args, { loaders, currentUser }) => {
                return loaders.reservationsForUser.load(source.id)
            } 
        }
    };
    return userFields;
};

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => fieldsWrapper(),
});

export const UserInput = new GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
      username: { type: new GraphQLNonNull(GraphQLString) },
      firstName: { type: GraphQLString },
      lastName: { type: GraphQLString },
    }),
});

export const UserPayload = new GraphQLObjectType({
    name: 'UserPayload',
    fields: () => ({
        errors: {
            type: new GraphQLNonNull(
                new GraphQLList(new GraphQLNonNull(UserError))
            ),
        },
        user: { type: User }
    }),
});


export const UserError = new GraphQLObjectType({
    name: 'UserError',
    fields: () => ({
      message: {
        type: new GraphQLNonNull(GraphQLString),
      },
    }),
});
  
export type UserPayloadType = typeof UserPayload
export type UserInputType = typeof UserInput;
export type UserType = typeof User

export default User;