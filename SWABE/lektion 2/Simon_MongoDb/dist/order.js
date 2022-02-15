"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const mongoose_1 = require("mongoose");
exports.schema = new mongoose_1.Schema({
    material: String,
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    price: { type: Number, required: true },
    timestamp: { type: String, required: true },
    delivery: {
        first_name: String,
        last_name: String,
        address: {
            street_name: String,
            street_number: String,
            city: String
        }
    }
});
