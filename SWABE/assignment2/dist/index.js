"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_graphql_1 = require("express-graphql");
const graphql_1 = require("graphql");
// //import { schema } from './schema/entry'; // Commented until local schema is no longer in use
const express = require("express");
// import cors from 'cors';
// import morgan =  require('morgan');
const config = __importStar(require("./config"));
const pg_api_1 = require("./db/pg-api");
const DataLoader = require("dataloader");
let schema = (0, graphql_1.buildSchema)(`
    type Query {
        hello: String
    }
    `);
// let root = {
//     hello: function() {
//         return "Hello World! poopoopeepee, haha, funny!"
//     }
// }
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = express();
        const pgApi = yield (0, pg_api_1.pgApiWrapper)();
        // server.use('/graphql', graphqlHTTP({
        //     schema: schema,
        //     rootValue: root,
        //     graphiql: true
        // }));
        // server.use(cors());
        // server.use(express.urlencoded({ extended: false }));
        // server.use(express.json());
        server.use('/graphql', (_, __) => {
            const loaders = {
                users: new DataLoader((userIds) => pgApi.queries.usersInfo(userIds))
            };
            (0, express_graphql_1.graphqlHTTP)({
                schema,
                context: { pgApi, loaders },
                graphiql: true,
                customFormatErrorFn: (err) => {
                    const errorReport = {
                        message: err.message,
                        locations: err.locations,
                        stack: err.stack ? err.stack.split('\n') : [],
                        path: err.path,
                    };
                    console.error('GraphQL Error', errorReport);
                    return config.isDev
                        ? errorReport
                        : { message: 'Oops! Something went wrong! :(' };
                },
            });
        });
        server.listen(config.PORT, () => {
            console.log(`Server URL: http://localhost:${config.PORT}/`);
        });
    });
}
main();
//# sourceMappingURL=index.js.map