"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const UserError = new graphql_1.GraphQLObjectType({
    name: 'UserError',
    fields: () => ({
        message: {
            type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLString),
        },
    }),
});
exports.default = UserError;
//# sourceMappingURL=user-error.js.map