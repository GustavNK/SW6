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
const payload_user_1 = __importDefault(require("./types/payload-user"));
const input_user_1 = require("./types/input-user");
const MutationType = new graphql_1.GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        userCreate: {
            type: new graphql_1.GraphQLNonNull(payload_user_1.default),
            args: {
                input: { type: new graphql_1.GraphQLNonNull(input_user_1.UserInput) },
            },
            resolve: (source, { input }, { mutators }) => __awaiter(void 0, void 0, void 0, function* () {
                return mutators.userCreate(input);
            }),
        },
    })
});
exports.default = MutationType;
//# sourceMappingURL=mutations.js.map