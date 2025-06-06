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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.fetchExchangeRates = void 0;
const cheerio = __importStar(require("cheerio"));
const axios_1 = __importDefault(require("axios"));
// Fetches the USD exchange rate and date from the BCV website.
const fetchExchangeRates = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res;
        try {
            res = yield (0, axios_1.default)('https://www.bcv.org.ve');
        }
        catch (error) {
            console.error("Error fetching the BCV page:", error);
            throw new Error('Failed to fetch BCV page');
        }
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);
        const dateElement = $('.pull-right.dinpro.center .date-display-single');
        const dateValue = dateElement.text().trim();
        const rateElements = $('.field-content');
        let usdRate = null;
        rateElements.each((index, element) => {
            const currencyElement = $(element).find('.col-sm-6.col-xs-6 span');
            const valueElement = $(element).find('.col-sm-6.col-xs-6.centrado');
            const currency = currencyElement.text().trim();
            const rateValue = valueElement.text().trim();
            if (currency === 'USD') {
                usdRate = { currency: currency, rate: rateValue, date: dateValue };
                return false;
            }
        });
        if (!usdRate) {
            throw new Error('USD rate not found on the page');
        }
        return usdRate;
    }
    catch (err) {
        console.error("Error to obtain the exchange rate from USD:", err);
        throw new Error('Failed to fetch USD exchange rate');
    }
});
exports.fetchExchangeRates = fetchExchangeRates;
//# sourceMappingURL=scraping.js.map