"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInput = void 0;
const graphql_1 = require("graphql");
exports.UserInput = new graphql_1.GraphQLInputObjectType({
    name: 'UserInput',
    fields: () => ({
        username: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString) },
        firstName: { type: graphql_1.GraphQLString },
        lastName: { type: graphql_1.GraphQLString },
    }),
});
//# sourceMappingURL=input-user.js.map