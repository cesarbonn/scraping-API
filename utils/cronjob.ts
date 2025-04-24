import  cron from 'node-cron';
import { fetchExchangeRates } from '../utils/scraping';
import ExchangeRate from '../models/exchangeRates';


const fetchAndSaveExchangeRates = async () => {
    try {
        const exchangeRates = await fetchExchangeRates();
        console.log('Exchange rates fetched:', exchangeRates);

        // Make sure ExchangeRate model is accessible here or passed in
        const ExchangeRates = ExchangeRate;

        const { currency, rate, date } = exchangeRates;

        // 1. Convert rate to float
        const rateValue = parseFloat(
            rate.replace(/\./g, '') 
                .replace(',', '.')  
        );

        if (isNaN(rateValue)) {
            throw new Error(`Formato de tasa inválido: ${rate}`);
        }

        // 2. Convert date from "Jueves, 24 Abril 2025" to DATEONLY (YYYY-MM-DD)
        const formatDate = (dateStr: string): string => {
            // Eliminate the day of the week (e.g., "Jueves,") and space
            const datePart = dateStr.replace(/^[^,]+,/, '').trim();

            // Parse the date string
            const [day, monthName, year] = datePart.split(/\s+/);

            // Mapear names of months to numbers
            const months: Record<string, string> = {
                'Enero': '01', 'Febrero': '02', 'Marzo': '03',
                'Abril': '04', 'Mayo': '05', 'Junio': '06',
                'Julio': '07', 'Agosto': '08', 'Septiembre': '09',
                'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
            };

            const monthNumber = months[monthName];
            if (!monthNumber) {
                // Fallback or handle unrecognised month name if needed
                 console.warn(`Nombre de mes no reconocido: ${monthName}. Intentando parsear directamente.`);
                 // Attempt to parse using Date object, may fail if format isn't standard
                 const dateObjFromStr = new Date(dateStr);
                 if (!isNaN(dateObjFromStr.getTime())) {
                     const year = dateObjFromStr.getFullYear();
                     const month = (dateObjFromStr.getMonth() + 1).toString().padStart(2, '0');
                     const day = dateObjFromStr.getDate().toString().padStart(2, '0');
                     return `${year}-${month}-${day}`;
                 } else {
                    throw new Error(`Nombre de mes o formato de fecha no reconocido: ${dateStr}`);
                 }
            }

            // Format as YYYY-MM-DD
            const formattedDate = `${year}-${monthNumber}-${day.padStart(2, '0')}`;

            // Validate date string before returning
             const dateObj = new Date(formattedDate);
             if (isNaN(dateObj.getTime())) {
                 throw new Error(`Fecha inválida después de formatear: ${formattedDate} (original: ${dateStr})`);
             }

            return formattedDate;
        };

        const formattedDate = formatDate(date);

        // Create the object to save in the database
        const rateToSave = {
            currency,
            rate: rateValue,
            date: formattedDate
        };

        console.log('Datos procesados para guardar:', rateToSave);

        // Save or update the rate in the database
        const [savedRate, created] = await ExchangeRates.upsert(rateToSave);

        console.log(`Tasa de cambio ${created ? 'creada' : 'actualizada'} exitosamente para la fecha ${formattedDate}`);
        console.log('Tarea de scraper completada');

    } catch (error) {
        console.error('Error durante la ejecución de la tarea de scraper:', error);
        // Depending on your needs, you might want to re-throw the error
        // throw error;
    }
};



export const cronjob = async () => {
    try {

        console.log('Ejecutando tarea de scraper al inicio del servidor...');
        await fetchAndSaveExchangeRates();
        console.log('Tarea de scraper al inicio completada.');
        // Schedule the task to run every 12 hours and when the server starts
        const twelveHourSchedule = '0 */12 * * *';
        console.log(`Programando tarea de scraper para ejecutarse con la expresión cron: ${twelveHourSchedule}`);

        cron.schedule(twelveHourSchedule, async () => {
            console.log('Ejecutando tarea de scraper programada...');
            await fetchAndSaveExchangeRates();
            console.log('Tarea de scraper programada completada.');
        });

        console.log('Cron job scheduler iniciado correctamente.');

    } catch (error) {
        console.error('Error al configurar o ejecutar el scraper:', error);
    }
};


export default cronjob;