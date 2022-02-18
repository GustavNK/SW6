"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orders_router_1 = require("./orders-router");
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.json());
app.get('/', (req, res) => res.json({ test: 'Hej' }));
app.use('/orders', orders_router_1.orders);
app.listen(3000, () => {
    console.log(`Server running on ${port}`);
});
