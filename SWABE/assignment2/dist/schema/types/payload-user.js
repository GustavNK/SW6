"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const user_1 = __importDefault(require("./user"));
const user_error_1 = __importDefault(require("./user-error"));
const UserPayload = new graphql_1.GraphQLObjectType({
    name: 'UserPayload',
    fields: () => ({
        errors: {
            type: new graphql_1.GraphQLNonNull(new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(user_error_1.default))),
        },
        user: { type: user_1.default },
        //authToken: { type: GraphQLString },
    }),
});
exports.default = UserPayload;
//# sourceMappingURL=payload-user.js.map