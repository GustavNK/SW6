"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const graphql_1 = require("graphql");
const mutations_1 = __importDefault(require("./mutations"));
const queries_1 = __importDefault(require("./queries"));
exports.schema = new graphql_1.GraphQLSchema({
    query: queries_1.default,
    mutation: mutations_1.default,
});
//# sourceMappingURL=entry.js.map