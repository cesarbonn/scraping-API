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
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importDefault(require("./models/server"));
const scraping_1 = require("./utils/scraping");
const node_cron_1 = __importDefault(require("node-cron"));
const exchangeRates_1 = __importDefault(require("./models/exchangeRates"));
dotenv_1.default.config();
console.log('Valor de NODE_EXTRA_CA_CERTS:', process.env.NODE_EXTRA_CA_CERTS);
const server = new server_1.default();
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        node_cron_1.default.schedule('*/90 * * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const exchangeRates = yield (0, scraping_1.fetchExchangeRates)();
                console.log('Exchange rates fetched:', exchangeRates);
                // Obtener el modelo
                const ExchangeRates = exchangeRates_1.default;
                // Convertir y preparar los datos para la BD
                const { currency, rate, date } = exchangeRates;
                // 1. Convertir rate a float
                const rateValue = parseFloat(rate.replace(/\./g, '') // Eliminar puntos de miles
                    .replace(',', '.') // Reemplazar coma decimal por punto
                );
                if (isNaN(rateValue)) {
                    throw new Error(`Formato de tasa inválido: ${rate}`);
                }
                // 2. Convertir fecha de "Jueves, 24 Abril 2025" a DATEONLY
                const formatDate = (dateStr) => {
                    // Eliminar el día de la semana y limpiar espacios
                    const datePart = dateStr.replace(/^[^,]+,/, '').trim();
                    // Parsear día, mes y año
                    const [day, monthName, year] = datePart.split(/\s+/);
                    // Mapear nombres de meses en español a números
                    const months = {
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
                const [savedRate, created] = yield ExchangeRates.upsert(rateToSave);
                console.log(`Tasa de cambio ${created ? 'creada' : 'actualizada'} exitosamente`);
                console.log('Scraper ejecutado correctamente');
            }
            catch (error) {
                console.error('Error en el proceso:', error);
            }
        }));
    }
    catch (error) {
        console.error('Error al ejecutar el scraper:', error);
    }
}))();
server.listen();
//# sourceMappingURL=app.js.map