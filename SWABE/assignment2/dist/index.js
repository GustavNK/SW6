"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_graphql_1 = require("express-graphql");
const entry_1 = require("./schema/entry");
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const config = __importStar(require("./config"));
const pg_api_1 = require("./db/pg-api");
const DataLoader = require("dataloader");
const morgan_1 = __importDefault(require("morgan"));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = express();
        const pgApi = yield (0, pg_api_1.pgApiWrapper)();
        server.use((0, cors_1.default)());
        server.use((0, morgan_1.default)('dev'));
        server.use(express.urlencoded({ extended: false }));
        server.use(express.json());
        server.use('/:fav.ico', (req, res) => res.sendStatus(204));
        server.use('/graphql', (req, res) => __awaiter(this, void 0, void 0, function* () {
            const loaders = {
                users: new DataLoader((userIds) => pgApi.queries.usersInfo(userIds))
            };
            const mutators = Object.assign({}, pgApi.mutators);
            (0, express_graphql_1.graphqlHTTP)({
                schema: entry_1.schema,
                context: { loaders, mutators },
                graphiql: true,
                customFormatErrorFn: (err) => {
                    const errorReport = {
                        message: err.message + "HELLO",
                        locations: err.locations,
                        stack: err.stack ? err.stack.split('\n') : [],
                        path: err.path,
                    };
                    console.error('GraphQL Error', errorReport);
                    return config.isDev
                        ? errorReport
                        : { message: 'Oops Woopsie! Sumthing wuent veery bad! :(' };
                },
            })(req, res);
        }));
        server.listen(config.PORT, () => {
            console.log(`Server URL: http://localhost:${config.PORT}/`);
        });
    });
}
main();
//# sourceMappingURL=index.js.map