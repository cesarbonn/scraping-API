import * as cheerio from "cheerio";
import axios from "axios";

export const fetchExchangeRates = async (): Promise<{ currency: string; rate: string; date: string }> => {
    try {
        const res = await axios('https://www.bcv.org.ve');
        const htmlData = res.data;
        const $ = cheerio.load(htmlData);

        const dateElement = $('.pull-right.dinpro.center .date-display-single', htmlData);
        const dateValue = dateElement.text().trim();

        const rateElements = $('.field-content', htmlData);
        let usdRate = null;

        rateElements.each((index, element) => {
            const currencyElement = $(element).find('.col-sm-6.col-xs-6 span');
            const valueElement = $(element).find('.col-sm-6.col-xs-6.centrado');
            const currency = currencyElement.text().trim();
            const rateValue = valueElement.text().trim();

            if (currency === 'USD') {
                usdRate = {
                    currency: currency,
                    rate: rateValue,
                    date: dateValue
                };
                return false; // Salir del bucle each
            }
        });

        if (!usdRate) {
            throw new Error('USD rate not found on the page');
        }

        return usdRate;

    } catch (err) {
        console.error("Error al obtener la tasa de cambio del USD:", err);
        throw new Error('Failed to fetch USD exchange rate');
    }
};