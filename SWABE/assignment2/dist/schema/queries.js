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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const user_1 = __importDefault(require("./types/user"));
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
        UserInfo: {
            type: graphql_1.GraphQLInt,
            args: {
                id: { type: new graphql_1.GraphQLNonNull(graphql_1.GraphQLInt) }
            },
            resolve: (source, args, { loaders }) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(source, "SOURCE");
                console.log(args, "ARGS");
                console.log(loaders, "CONTEXT");
                return yield loaders.userInfo.load(args.id);
            })
        },
        getAllUsers: {
            type: new graphql_1.GraphQLList(new graphql_1.GraphQLNonNull(user_1.default)),
            resolve: (source, args, { pgApi }) => __awaiter(void 0, void 0, void 0, function* () {
                return yield pgApi.queries.getAllUsers();
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