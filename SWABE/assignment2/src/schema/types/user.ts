import {
    GraphQLID,
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLList,
} from 'graphql';

//import Task from './task';
type permissions = 'admin' | 'manager' | 'clerk';


const fieldsWrapper = ({ role }) => {
    const userFields = {
        id: { type: new GraphQLNonNull(GraphQLID) },
        username: { type: GraphQLString },
        name: {
            type: new GraphQLNonNull(GraphQLString),
            resolve: ({ firstName, lastName }) =>
                [firstName, lastName].filter(Boolean).join(' '),
        },
        // reservations: {
        //     type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Reservation))),
        //     resolve: (source, args, { loaders, currentUser }) => {
        //         return loaders.reservationsForUser.load()
        //     }
        // }
    };

    // if (role) {
    //     userFields.taskList = {
    //         type: new GraphQLNonNull(
    //             new GraphQLList(new GraphQLNonNull(Task))
    //         ),
    //         resolve: (source, args, { loaders, currentUser }) => {
    //             return loaders.tasksForUsers.load(currentUser.id);
    //         },
    //     };
    // }

    return userFields;
};

const User = new GraphQLObjectType({
    name: 'User',
    fields: () => fieldsWrapper({ role: false }),
});

export type UserType = typeof User

export const Me = new GraphQLObjectType({
    name: 'Me',
    fields: () => fieldsWrapper({ role: true }),
});

export default User;