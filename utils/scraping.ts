import * as cheerio from "cheerio"; 
import axios from "axios"; 

// Fetches the USD exchange rate and date from the BCV website.
export const fetchExchangeRates = async (): Promise<{ currency: string; rate: string; date: string }> => {
    
    try {

        let res;
        try {
            res = await axios('https://www.bcv.org.ve'); 

        } catch (error) {
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
                usdRate = { currency: currency , rate: rateValue, date: dateValue };
                return false; 
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