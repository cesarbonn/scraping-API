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
        const exchangeRate = exchangeRates_1.default; // Get the ExchangeRate model
        const result = yield exchangeRate.findAll(); // Fetch all exchange rates
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No exchange rates found' });
        }
        const { currency, rate, date } = result[0];
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
    const { start_date, end_date } = req.query; // Get start and end dates from query parameters
    try {
        // Build the where clause conditionally
        const whereClause = {};
        // If both start and end dates are provided
        if (start_date && end_date) {
            // Validate the format of the dates
            if (isNaN(Date.parse(start_date))) {
                return res.status(400).json({ error: 'Invalid start date format' }); // Return 400 for invalid start date
            }
            if (isNaN(Date.parse(end_date))) {
                return res.status(400).json({ error: 'Invalid end date format' }); // Return 400 for invalid end date
            }
            if (start_date > end_date) {
                return res.status(400).json({ error: 'Start date cannot be greater than end date' }); // Return 400 if start date is after end date
            }
            // Filter exchange rates within the specified date range
            whereClause.date = sequelize_1.Sequelize.where(sequelize_1.Sequelize.fn('DATE', sequelize_1.Sequelize.col('date')), // Apply DATE() function to the 'date' column for comparison
            {
                [sequelize_1.Op.between]: [
                    start_date, // Compare the extracted date with the start_date string
                    end_date // Compare the extracted date with the end_date string
                ]
            });
        }
        else if (start_date || end_date) {
            return res.status(400).json({
                error: 'You must provide both start_date and end_date or neither'
            }); // Return 400 if only one date is provided
        }
        // Query the database for exchange rates based on the where clause
        const rates = yield exchangeRates_1.default.findAll({
            where: whereClause,
            order: [['date', 'DESC']], // Order the results by date in descending order
            attributes: ['currency', 'rate', 'date'] // Select specific attributes to return
        });
        // If no rates are found based on the criteria
        if (!rates || rates.length === 0) {
            return res.status(404).json(Object.assign({ error: 'No exchange rates found' }, (start_date && end_date && {
                suggestion: `Try a different date range than ${start_date} - ${end_date}`
            }))); // Return 404 with a suggestion if a date range was provided
        }
        // Format the response
        return res.status(200).json(Object.assign({ success: true, count: rates.length, data: rates }, (start_date && end_date && {
            dateRange: {
                start: start_date,
                end: end_date
            }
        })));
    }
    catch (error) {
        console.error('Error consulting exchange rates:', error); // Log the error
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Unknown error' // Provide more details if the error is an instance of Error
        });
    }
});
exports.getRatesHistory = getRatesHistory;
//# sourceMappingURL=rates.js.map