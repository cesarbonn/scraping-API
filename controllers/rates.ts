import e, { Request, Response } from 'express';
import { fetchExchangeRates } from '../utils/scraping';
import ExchangeRate from '../models/exchangeRates';
import { Op, Sequelize } from 'sequelize';

export const getRateCurrent = async (req: Request, res: Response) => {

    try {

        const exchangeRate = ExchangeRate;
        const result = await exchangeRate.findAll();
        if (!result) {
            return res.status(404).json({ error: 'No exchange rates found' });
        }
        const { currency, rate, date } = result[0];

        return res.status(200).json({
            currency,
            rate,
            date
        });

    } catch (error) {
        console.error('Error consulting exchange rates:', error);
        return res.status(500).json({ error: 'Internal Server Error' });

    }
}

export const getRatesHistory = async (req: Request, res: Response) => {
    const { start_date, end_date } = req.query;

    try {
        // Construir objeto where condicionalmente
        const whereClause: any = {};

        if (start_date && end_date) {
            // Validar formato de fechas
            if (isNaN(Date.parse(start_date as string))) {
                return res.status(400).json({ error: 'Formato de fecha inicial inválido' });
            }
            if (isNaN(Date.parse(end_date as string))) {
                return res.status(400).json({ error: 'Formato de fecha final inválido' });
            }
            if (start_date > end_date) {
                return res.status(400).json({ error: 'La fecha inicial no puede ser mayor que la fecha final' });
            }

            whereClause.date = Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('date')), // Aplica DATE() a la columna 'date'
                {
                    [Op.between]: [
                        start_date as string, // Compara la fecha extraída con la cadena start_date
                        end_date as string    // Compara la fecha extraída con la cadena end_date
                    ]
                }
            );

        } else if (start_date || end_date) {
            return res.status(400).json({
                error: 'Debes proporcionar ambas fechas (start_date y end_date) o ninguna'
            });
        }

        // Consultar la base de datos
        const rates = await ExchangeRate.findAll({
            where: whereClause,
            order: [['date', 'DESC']], // Ordenar por fecha descendente
            attributes: ['currency', 'rate', 'date'] // Seleccionar campos específicos
        });

        if (!rates || rates.length === 0) {
            return res.status(404).json({
                error: 'No se encontraron tasas de cambio',
                ...(start_date && end_date && {
                    suggestion: `Intenta con un rango de fechas diferente al ${start_date} - ${end_date}`
                })
            });
        }

        // Formatear respuesta
        return res.status(200).json({
            success: true,
            count: rates.length,
            data: rates,
            ...(start_date && end_date && {
                dateRange: {
                    start: start_date,
                    end: end_date
                }
            })
        });

    } catch (error) {
        console.error('Error consulting exchange rates:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            details: error instanceof Error ? error.message : 'Error desconocido'
        });
    }
};





