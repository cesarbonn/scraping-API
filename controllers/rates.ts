import express, { Request, Response } from 'express';
import ExchangeRate from '../models/exchangeRates';
import { Op, Sequelize } from 'sequelize';

// Controller for fetching the current exchange rate
export const getRateCurrent = async (req: Request, res: Response) => {

    try {

        const exchangeRate = ExchangeRate; // Get the ExchangeRate model
        const result = await exchangeRate.findAll(); // Fetch all exchange rates
        if (!result || result.length === 0) {
            return res.status(404).json({ error: 'No exchange rates found' }); 
        }

        const { currency, rate, date } = result[0];

        return res.status(200).json({ // Return the current rate data
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
    const { start_date, end_date } = req.query; // Get start and end dates from query parameters

    try {
        // Build the where clause conditionally
        const whereClause: any = {};

        // If both start and end dates are provided
        if (start_date && end_date) {
            // Validate the format of the dates
            if (isNaN(Date.parse(start_date as string))) {
                return res.status(400).json({ error: 'Invalid start date format' }); // Return 400 for invalid start date
            }
            if (isNaN(Date.parse(end_date as string))) {
                return res.status(400).json({ error: 'Invalid end date format' }); // Return 400 for invalid end date
            }
            if (start_date > end_date) {
                return res.status(400).json({ error: 'Start date cannot be greater than end date' }); // Return 400 if start date is after end date
            }

            // Filter exchange rates within the specified date range
            whereClause.date = Sequelize.where(
                Sequelize.fn('DATE', Sequelize.col('date')), // Apply DATE() function to the 'date' column for comparison
                {
                    [Op.between]: [
                        start_date as string, // Compare the extracted date with the start_date string
                        end_date as string // Compare the extracted date with the end_date string
                    ]
                }
            );

        } else if (start_date || end_date) {
            return res.status(400).json({
                error: 'You must provide both start_date and end_date or neither'
            }); // Return 400 if only one date is provided
        }

        // Query the database for exchange rates based on the where clause
        const rates = await ExchangeRate.findAll({
            where: whereClause,
            order: [['date', 'DESC']], // Order the results by date in descending order
            attributes: ['currency', 'rate', 'date'] // Select specific attributes to return
        });

        // If no rates are found based on the criteria
        if (!rates || rates.length === 0) {
            return res.status(404).json({
                error: 'No exchange rates found',
                ...(start_date && end_date && {
                    suggestion: `Try a different date range than ${start_date} - ${end_date}`
                })
            }); // Return 404 with a suggestion if a date range was provided
        }

        // Format the response
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
        console.error('Error consulting exchange rates:', error); // Log the error
        return res.status(500).json({
            error: 'Internal Server Error', 
            details: error instanceof Error ? error.message : 'Unknown error' // Provide more details if the error is an instance of Error
        });
    }
};





