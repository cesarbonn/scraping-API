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
exports.getRatesHistory = exports.getRateCurrent = void 0;
const exchangeRates_1 = __importDefault(require("../models/exchangeRates"));
const sequelize_1 = require("sequelize");
const getRateCurrent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exchangeRate = exchangeRates_1.default;
        const result = yield exchangeRate.findAll();
        if (!result) {
            return res.status(404).json({ error: 'No exchange rates found' });
        }
        const { currency, rate, date } = result[0];
        return res.status(200).json({
            currency,
            rate,
            date
        });
    }
    catch (error) {
        console.error('Error consulting exchange rates:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getRateCurrent = getRateCurrent;
const getRatesHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { start_date, end_date } = req.query;
    try {
        // Construir objeto where condicionalmente
        const whereClause = {};
        if (start_date && end_date) {
            // Validar formato de fechas
            if (isNaN(Date.parse(start_date))) {
                return res.status(400).json({ error: 'Formato de fecha inicial inválido' });
            }
            if (isNaN(Date.parse(end_date))) {
                return res.status(400).json({ error: 'Formato de fecha final inválido' });
            }
            whereClause.date = {
                [sequelize_1.Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }
        else if (start_date || end_date) {
            return res.status(400).json({
                error: 'Debes proporcionar ambas fechas (start_date y end_date) o ninguna'
            });
        }
        // Consultar la base de datos
        const rates = yield exchangeRates_1.default.findAll({
            where: whereClause,
            order: [['date', 'DESC']], // Ordenar por fecha descendente
            attributes: ['currency', 'rate', 'date'] // Seleccionar campos específicos
        });
        if (!rates || rates.length === 0) {
            return res.status(404).json(Object.assign({ error: 'No se encontraron tasas de cambio' }, (start_date && end_date && {
                suggestion: `Intenta con un rango de fechas diferente al ${start_date} - ${end_date}`
            })));
        }
        // Formatear respuesta
        return res.status(200).json(Object.assign({ success: true, count: rates.length, data: rates }, (start_date && end_date && {
            dateRange: {
                start: start_date,
                end: end_date
            }
        })));
    }
    catch (error) {
        console.error('Error consulting exchange rates:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
});
exports.getRatesHistory = getRatesHistory;
//# sourceMappingURL=rates.js.map