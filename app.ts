import dotenv from 'dotenv';
import Server from './models/server';
import { fetchExchangeRates } from './utils/scraping';
import cron from 'node-cron';
import ExchangeRate from './models/exchangeRates';
dotenv.config();





console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS); 

const server = new Server();

(async () => {
    try {
        cron.schedule('*/90 * * * * *', async () => {
            try {
                const exchangeRates = await fetchExchangeRates();
                console.log('Exchange rates fetched:', exchangeRates);
                
                // Obtener el modelo
                const ExchangeRates = ExchangeRate;
                
                // Convertir y preparar los datos para la BD
                const { currency, rate, date } = exchangeRates;
                
                // 1. Convertir rate a float
                const rateValue = parseFloat(
                    rate.replace(/\./g, '') // Eliminar puntos de miles
                        .replace(',', '.')  // Reemplazar coma decimal por punto
                );
                
                if (isNaN(rateValue)) {
                    throw new Error(`Formato de tasa inválido: ${rate}`);
                }
                
                // 2. Convertir fecha de "Jueves, 24 Abril 2025" a DATEONLY
                const formatDate = (dateStr: string): string => {
                    // Eliminar el día de la semana y limpiar espacios
                    const datePart = dateStr.replace(/^[^,]+,/, '').trim();
                    
                    // Parsear día, mes y año
                    const [day, monthName, year] = datePart.split(/\s+/);
                    
                    // Mapear nombres de meses en español a números
                    const months: Record<string, string> = {
                        'Enero': '01', 'Febrero': '02', 'Marzo': '03',
                        'Abril': '04', 'Mayo': '05', 'Junio': '06',
                        'Julio': '07', 'Agosto': '08', 'Septiembre': '09',
                        'Octubre': '10', 'Noviembre': '11', 'Diciembre': '12'
                    };
                    
                    const monthNumber = months[monthName];
                    if (!monthNumber) {
                        throw new Error(`Nombre de mes no reconocido: ${monthName}`);
                    }
                    
                    // Formatear como YYYY-MM-DD
                    const formattedDate = `${year}-${monthNumber}-${day.padStart(2, '0')}`;
                    
                    // Validar fecha
                    const dateObj = new Date(formattedDate);
                    if (isNaN(dateObj.getTime())) {
                        throw new Error(`Fecha inválida: ${formattedDate}`);
                    }
                    
                    return formattedDate;
                };
                
                const formattedDate = formatDate(date);
                
                // Crear objeto para guardar
                const rateToSave = {
                    currency,
                    rate: rateValue,
                    date: formattedDate
                };
                
                console.log('Datos procesados para guardar:', rateToSave);
                
                // Guardar en la base de datos
                const [savedRate, created] = await ExchangeRates.upsert(rateToSave);
                
                console.log(`Tasa de cambio ${created ? 'creada' : 'actualizada'} exitosamente`);
                console.log('Scraper ejecutado correctamente');
                
            } catch (error) {
                console.error('Error en el proceso:', error);
            }
        });
    } catch (error) {
        console.error('Error al ejecutar el scraper:', error);
    }
})();
server.listen();
