"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Me = void 0;
const graphql_1 = require("graphql");
const fieldsWrapper = ({ role }) => {
    const userFields = {
        id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLID) },
        username: { type: graphql_1.GraphQLString },
        name: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
            resolve: ({ firstName, lastName }) => [firstName, lastName].filter(Boolean).join(' '),
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
const User = new graphql_1.GraphQLObjectType({
    name: 'User',
    fields: () => fieldsWrapper({ role: false }),
});
exports.Me = new graphql_1.GraphQLObjectType({
    name: 'Me',
    fields: () => fieldsWrapper({ role: true }),
});
exports.default = User;
//# sourceMappingURL=user.js.map