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
exports.Orders = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const promises_1 = require("fs/promises");
const order_1 = require("./order");
const ordersConnection = mongoose_1.default.createConnection('mongodb://localhost:27017/orders');
const OrderModel = ordersConnection.model('Order', order_1.schema);
const seed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let orderData = yield (0, promises_1.readFile)('./assets/mock_data.json', 'utf-8');
    let orderResult = yield OrderModel.insertMany(JSON.parse(orderData));
    res.json({
        orderData: {
            ids: orderResult.map(t => t._id),
            cnt: orderResult.length,
        }
    });
});
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { src, dst, f, t, m } = req.query;
    let filter = {};
    if (m) {
        filter = { material: { $not: { $eq: m } } };
    }
    if (dst) {
        filter = Object.assign(Object.assign({}, filter), { dst });
    }
    if (f && t) {
        filter = Object.assign(Object.assign({}, filter), { ts: { $gt: f, $lt: t } });
    }
    else {
        if (f) {
            filter = Object.assign(Object.assign({}, filter), { ts: { $gt: f } });
        }
        if (t) {
            filter = Object.assign(Object.assign({}, filter), { ts: { $lt: t } });
        }
    }
    let result = yield OrderModel.find(filter, { __v: 0 }).lean();
    res.json(result);
});
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { id } = yield new OrderModel(req.body).save();
    res.json({ id });
});
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    let result = yield OrderModel.find({ _id: uid }, { __v: 0 }).exec();
    res.json(result);
});
const overwrite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    const body = req.body;
    let result = yield OrderModel.findOne({ _id: uid }, { __v: 0 }).exec();
    if (result) {
        let resp = result.overwrite(body);
        res.json(resp);
    }
    else {
        res.sendStatus(404);
    }
});
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    console.log(uid);
    let result = yield OrderModel.updateOne({ _id: uid }, { $set: { amnt: 100, src: '123', dst: '321' } }).exec();
    res.json({ uid, result });
});
const remove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { uid } = req.params;
    let result = yield OrderModel.deleteOne({ _id: uid });
    res.json(result);
});
exports.Orders = {
    list, create, read, overwrite, update, remove, seed
};
