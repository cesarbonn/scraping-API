import { Router} from "express";
import {getRatesHistory, getRateCurrent } from "../controllers/rates"; 

const router = Router();

// Define the routes for the rate API
router.get('/current', async (req, res, next) => {
    try {
        await getRateCurrent(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/history', async (req, res, next) => {
    try {
        await getRatesHistory(req, res);
    } catch (error) {
        next(error);
    }
});






export default router;