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
exports.cronjob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const scraping_1 = require("../utils/scraping");
const exchangeRates_1 = __importDefault(require("../models/exchangeRates"));
const fetchAndSaveExchangeRates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exchangeRates = yield (0, scraping_1.fetchExchangeRates)();
        console.log('Exchange rates fetched:', exchangeRates);
        // Make sure ExchangeRate model is accessible here or passed in
        const ExchangeRates = exchangeRates_1.default;
        const { currency, rate, date } = exchangeRates;
        // Convert rate to float, handling different decimal and thousand separators
        const rateValue = parseFloat(rate.replace(/\./g, '')
            .replace(',', '.'));
        if (isNaN(rateValue)) {
            throw new Error(`Invalid rate format: ${rate}`);
        }
        // Convert date from "Jueves, 24 Abril 2025" to DATEONLY (YYYY-MM-DD)
        const formatDate = (dateStr) => {
            // Remove the day of the week and the following comma and space
            const datePart = dateStr.replace(/^[^,]+,/, '').trim();
            // Split the date part into day, month name, and year
            const [day, monthName, year] = datePart.split(/\s+/);
            // Map Spanish month names to their corresponding numbers
            const months = {
                'Enero': '01', 'Febrero': '02', 'Marzo': '03',
                'Abril': '04', 'Mayo': '05', 'Junio': '06',
                'Julio': '07', 'Agosto': '08', 'Septiembre': '09',
                'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
            };
            const monthNumber = months[monthName];
            if (!monthNumber) {
                // Fallback if the month name is not recognized
                console.warn(`Unrecognized month name: ${monthName}. Attempting direct parse.`);
                // Attempt to parse using Date object as a last resort
                const dateObjFromStr = new Date(dateStr);
                if (!isNaN(dateObjFromStr.getTime())) {
                    const year = dateObjFromStr.getFullYear();
                    const month = (dateObjFromStr.getMonth() + 1).toString().padStart(2, '0');
                    const day = dateObjFromStr.getDate().toString().padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
                else {
                    throw new Error(`Unrecognized month name or date format: ${dateStr}`);
                }
            }
            // Format the date as YYYY-MM-DD
            const formattedDate = `${year}-${monthNumber}-${day.padStart(2, '0')}`;
            // Validate the formatted date string
            const dateObj = new Date(formattedDate);
            if (isNaN(dateObj.getTime())) {
                throw new Error(`Invalid date after formatting: ${formattedDate} (original: ${dateStr})`);
            }
            return formattedDate;
        };
        const formattedDate = formatDate(date);
        // Prepare the data to be saved in the database
        const rateToSave = {
            currency,
            rate: rateValue,
            date: formattedDate
        };
        console.log('Processed data for saving:', rateToSave);
        // Save or update the exchange rate in the database
        const [savedRate, created] = yield ExchangeRates.upsert(rateToSave);
        console.log(`Exchange rate ${created ? 'created' : 'updated'} successfully for date ${formattedDate}`);
        console.log('Scraper task completed');
    }
    catch (error) {
        console.error('Error during scraper task execution:', error);
    }
});
const cronjob = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Executing scraper task on server start...');
        yield fetchAndSaveExchangeRates();
        console.log('Initial scraper task completed.');
        // Schedule the task to run every 12 hours
        const twelveHourSchedule = '0 */12 * * *';
        console.log(`Scheduling scraper task to run with cron expression: ${twelveHourSchedule}`);
        node_cron_1.default.schedule(twelveHourSchedule, () => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Executing scheduled scraper task...');
            yield fetchAndSaveExchangeRates();
            console.log('Scheduled scraper task completed.');
        }));
        console.log('Cron job scheduler started successfully.');
    }
    catch (error) {
        console.error('Error setting up or running the scraper:', error);
    }
});
exports.cronjob = cronjob;
exports.default = exports.cronjob;
//# sourceMappingURL=cronjob.js.map