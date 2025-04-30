import cron from 'node-cron';
import { fetchExchangeRates } from '../utils/scraping';
import ExchangeRate from '../models/exchangeRates';


// Function to fetch exchange rates and save them to the database
const fetchAndSaveExchangeRates = async () => {
    try {
        const exchangeRates = await fetchExchangeRates();
        console.log('Exchange rates fetched:', exchangeRates);

        const ExchangeRates = ExchangeRate;

        const { currency, rate, date } = exchangeRates;

        const rateValue = parseFloat(
            rate.replace(/\./g, '')
                .replace(',', '.')
        );

        if (isNaN(rateValue)) {
            throw new Error(`Invalid rate format: ${rate}`);
        }

        const formatDate = (dateStr: string): string => {
      
            const datePart = dateStr.replace(/^[^,]+,/, '').trim();

            const [day, monthName, year] = datePart.split(/\s+/);

            const months: Record<string, string> = {
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
                } else {
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
            rate:     rateValue,
            date:     formattedDate
        };

        console.log('Processed data for saving:', rateToSave);

        const [savedRate, created] = await ExchangeRates.upsert(rateToSave);

        console.log(`Exchange rate ${created ? 'created' : 'updated'} successfully for date ${formattedDate}`);
        console.log('Scraper task completed');

    } catch (error) {

        console.error('Error during scraper task execution:', error);
    }
};


// Function to schedule the scraper task 
export const cronjob = async () => {
    try {

        console.log('Executing scraper task on server start...');
        await fetchAndSaveExchangeRates();

        const Schedule = '0 * 0 * * *'; 

        console.log(`Scheduling scraper task to run with cron expression: ${Schedule}`);

        cron.schedule(Schedule, async () => {
            console.log('Executing scheduled scraper task...');
            await fetchAndSaveExchangeRates();
            console.log('Scheduled scraper task completed.');
        });

        console.log('Cron job scheduler started successfully.');

    } catch (error) {
        console.error('Error setting up or running the scraper:', error);
    }
};


export default cronjob;