import { Router, Request, Response, NextFunction } from "express";
import {getRatesHistory, getRateCurrent } from "../controllers/rates"; 

const router = Router();

// Define the routes for the API rates endpoint
router.get('/current', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getRateCurrent(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/history', async (req: Request, res: Response, next: NextFunction) => {
    try {
        await getRatesHistory(req, res);
    } catch (error) {
        next(error);
    }
});






export default router;