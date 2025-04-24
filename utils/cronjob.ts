import  cron from 'node-cron';
import { fetchExchangeRates } from './scraping';
import ExchangeRatesModel from '../models/exchangeRates';

const cronjob = async () => {
    try {
        cron.schedule('*/10 * * * * *', async () => {const exchangeRates = await fetchExchangeRates();
        console.log('Exchange rates fetched:', exchangeRates);
        console.log('Scraper executed successfully');
            // Obtener el modelo
            const ExchangeRates = ExchangeRatesModel;
            
            // // Guardar en la base de datos
            try {

                const {currency, rate, date} = exchangeRates;

                

                // Usamos bulkCreate con updateOnDuplicate
                // const savedRates = await ExchangeRates.bulkCreate(ratesWithDate);
                
                console.log(`Successfully saved/updated  exchange rates`);
            } catch (dbError) {
                console.error('Error saving to database:', dbError);
            }
            
        
        console.log('Scraper executed successfully');
    });
    } catch (error) {
        console.error('Error executing scraper:', error);
    }
};

export default cronjob;