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
const pg_1 = __importDefault(require("pg"));
const config_1 = require("../config");
function pgClient() {
    return __awaiter(this, void 0, void 0, function* () {
        const pgPool = new pg_1.default.Pool({
            connectionString: config_1.pgConnectionString,
        });
        // Test the connection
        const client = yield pgPool.connect();
        const tableCountResp = yield client.query('select count(*) from information_schema.tables where table_schema = $1;', ['azdev']);
        client.release();
        console.log('Connected to PostgreSQL | Tables count:', tableCountResp.rows[0].count);
        pgPool.on('error', (err) => {
            console.error('Unexpected PG client error', err);
            process.exit(-1);
        });
        return {
            pgPool,
            pgClose: () => __awaiter(this, void 0, void 0, function* () { return yield pgPool.end(); }),
        };
    });
}
exports.default = pgClient;
//# sourceMappingURL=pg-client.js.map