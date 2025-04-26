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
// Function to fetch exchange rates and save them to the database
const fetchAndSaveExchangeRates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exchangeRates = yield (0, scraping_1.fetchExchangeRates)();
        console.log('Exchange rates fetched:', exchangeRates);
        const ExchangeRates = exchangeRates_1.default;
        const { currency, rate, date } = exchangeRates;
        const rateValue = parseFloat(rate.replace(/\./g, '')
            .replace(',', '.'));
        if (isNaN(rateValue)) {
            throw new Error(`Invalid rate format: ${rate}`);
        }
        const formatDate = (dateStr) => {
            const datePart = dateStr.replace(/^[^,]+,/, '').trim();
            const [day, monthName, year] = datePart.split(/\s+/);
            const months = {
                'Enero': '01', 'Febrero': '02', 'Marzo': '03',
                'Abril': '04', 'Mayo': '05', 'Junio': '06',
                'Julio': '07', 'Agosto': '08', 'Septiembre': '09',
                'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
            };
            const monthNumber = months[monthName];
            if (!monthNumber) {
                console.warn(`Unrecognized month name: ${monthName}. Attempting direct parse.`);
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
            const formattedDate = `${year}-${monthNumber}-${day.padStart(2, '0')}`;
            const dateObj = new Date(formattedDate);
            if (isNaN(dateObj.getTime())) {
                throw new Error(`Invalid date after formatting: ${formattedDate} (original: ${dateStr})`);
            }
            return formattedDate;
        };
        const formattedDate = formatDate(date);
        const rateToSave = {
            currency: currency,
            rate: rateValue,
            date: formattedDate
        };
        console.log('Processed data for saving:', rateToSave);
        const [savedRate, created] = yield ExchangeRates.upsert(rateToSave);
        console.log(`Exchange rate ${created ? 'created' : 'updated'} successfully for date ${formattedDate}`);
        console.log('Scraper task completed');
    }
    catch (error) {
        console.error('Error during scraper task execution:', error);
    }
});
// Function to schedule the scraper task 
const cronjob = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Executing scraper task on server start...');
        yield fetchAndSaveExchangeRates();
        const Schedule = '0 * */23 * * *';
        console.log(`Scheduling scraper task to run with cron expression: ${Schedule}`);
        node_cron_1.default.schedule(Schedule, () => __awaiter(void 0, void 0, void 0, function* () {
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