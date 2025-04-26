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
exports.getRatesHistory = exports.getRateCurrent = void 0;
const exchangeRates_1 = __importDefault(require("../models/exchangeRates"));
const sequelize_1 = require("sequelize");
// Controller for fetching the current exchange rate
const getRateCurrent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exchangeRate = exchangeRates_1.default;
        const result = yield exchangeRate.findAll();
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No exchange rates found' });
        }
        const { currency, rate, date } = result[result.length - 1];
        return res.status(200).json({
            currency,
            rate,
            date
        });
    }
    catch (error) {
        console.error('Error consulting exchange rates:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getRateCurrent = getRateCurrent;
// Controller for fetching historical exchange rates based on a date range
const getRatesHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start_date, end_date } = req.query;
    try {
        const whereClause = {};
        if (start_date && end_date) {
            if (isNaN(Date.parse(start_date))) {
                return res.status(400).json({ error: 'Invalid start date format' });
            }
            if (isNaN(Date.parse(end_date))) {
                return res.status(400).json({ error: 'Invalid end date format' });
            }
            if (start_date > end_date) {
                return res.status(400).json({ error: 'Start date cannot be greater than end date' });
            }
            // Filter exchange rates within the specified date range
            whereClause.date = sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.col('date')), {
                [sequelize_1.Op.between]: [
                    start_date,
                    end_date
                ]
            });
        }
        else if (start_date || end_date) {
            return res.status(400).json({
                error: 'You must provide both start_date and end_date or neither'
            });
        }
        // Query the database for exchange rates based on the where clause
        const rates = yield exchangeRates_1.default.findAll({
            where: whereClause,
            order: [['date', 'DESC']],
            attributes: ['currency', 'rate', 'date']
        });
        if (!rates || rates.length === 0) {
            return res.status(404).json(Object.assign({ error: 'No exchange rates found' }, (start_date && end_date && {
                suggestion: `Try a different date range than ${start_date} - ${end_date}`
            })));
        }
        return res.status(200).json(Object.assign({ success: true, count: rates.length, data: rates }, (start_date && end_date && {
            dateRange: {
                start: start_date,
                end: end_date
            }
        })));
    }
    catch (error) {
        console.error('Error consulting exchange rates:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getRatesHistory = getRatesHistory;
//# sourceMappingURL=rates.js.map