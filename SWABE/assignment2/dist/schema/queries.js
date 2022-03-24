"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const QueryType = new graphql_1.GraphQLObjectType({
    name: 'Query',
    fields: {
        currentTime: {
            type: graphql_1.GraphQLString,
            resolve: () => {
                const isoString = new Date().toISOString();
                return isoString.slice(11, 19);
            },
        },
        Users: {
            type: graphql_1.GraphQLID,
            resolve: (source, userid, context) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(source, userid, context);
                return yield context.loaders.users(userid);
            })
        },
        name: {
            type: graphql_1.GraphQLString,
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
});
exports.default = QueryType;
//# sourceMappingURL=queries.js.map