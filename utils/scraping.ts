import * as cheerio from "cheerio"; // For HTML parsing
import axios from "axios"; // For HTTP requests

// Fetches the USD exchange rate from the BCV website.
export const fetchExchangeRates = async (): Promise<{ currency: string; rate: string; date: string }> => {
    try {
        const res = await axios('https://www.bcv.org.ve'); // Get the website HTML
        const htmlData = res.data;
        const $ = cheerio.load(htmlData); // Load HTML for easy querying

        // Extract the date of the exchange rate.
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
                usdRate = { currency, rate: rateValue, date: dateValue };
                return false; // Break the loop if USD is found
            }
        });

        if (!usdRate) {
            throw new Error('USD rate not found on the page');
        }

        return usdRate;

    } catch (err) {
        console.error("Error to obtain the exchange rate from USD:", err);
        throw new Error('Failed to fetch USD exchange rate');
    }
};