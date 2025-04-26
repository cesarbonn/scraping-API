import express, { Request, Response } from 'express';
import ExchangeRate from '../models/exchangeRates';
import { Op, Sequelize } from 'sequelize';

// Controller for fetching the current exchange rate
export const getRateCurrent = async (req: Request, res: Response) => {

    try {

        const exchangeRate = ExchangeRate; 
        const result = await exchangeRate.findAll(); 
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No exchange rates found' }); 
        }

        const { currency, rate, date } = result[result.length - 1];

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

// Controller for fetching historical exchange rates based on a date range
export const getRatesHistory = async (req: Request, res: Response) => {
    const { start_date, end_date } = req.query;

    try {
        
        const whereClause: any = {};
        if (start_date && end_date) {
            
            if (isNaN(Date.parse(start_date as string))) {
                return res.status(400).json({ error: 'Invalid start date format' }); 
            }
            if (isNaN(Date.parse(end_date as string))) {
                return res.status(400).json({ error: 'Invalid end date format' }); 
            }
            if (start_date > end_date) {
                return res.status(400).json({ error: 'Start date cannot be greater than end date' }); 
            }

            // Filter exchange rates within the specified date range
            whereClause.date = Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('date')), 
                {
                    [Op.between]: [
                        start_date as string, 
                        end_date as string 
                    ]
                }
            );

        } else if (start_date || end_date) {
            return res.status(400).json({
                error: 'You must provide both start_date and end_date or neither'
            }); 
        }

        // Query the database for exchange rates based on the where clause
        const rates = await ExchangeRate.findAll({
            where: whereClause,
            order: [['date', 'DESC']], 
            attributes: ['currency', 'rate', 'date'] 
        });

        if (!rates || rates.length === 0) {
            return res.status(404).json({
                error: 'No exchange rates found',
                ...(start_date && end_date && {
                    suggestion: `Try a different date range than ${start_date} - ${end_date}`
                })
            }); 
        }

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
            details: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
};





