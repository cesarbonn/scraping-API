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
const node_cron_1 = __importDefault(require("node-cron"));
const scraping_1 = require("./scraping");
const exchangeRates_1 = __importDefault(require("../models/exchangeRates"));
const cronjob = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        node_cron_1.default.schedule('*/10 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
            const exchangeRates = yield (0, scraping_1.fetchExchangeRates)();
            console.log('Exchange rates fetched:', exchangeRates);
            console.log('Scraper executed successfully');
            // Obtener el modelo
            const ExchangeRates = exchangeRates_1.default;
            // // Guardar en la base de datos
            try {
                const { currency, rate, date } = exchangeRates;
                // Usamos bulkCreate con updateOnDuplicate
                // const savedRates = await ExchangeRates.bulkCreate(ratesWithDate);
                console.log(`Successfully saved/updated  exchange rates`);
            }
            catch (dbError) {
                console.error('Error saving to database:', dbError);
            }
            console.log('Scraper executed successfully');
        }));
    }
    catch (error) {
        console.error('Error executing scraper:', error);
    }
});
exports.default = cronjob;
//# sourceMappingURL=cronjob.js.map