import express from "express";
import { createOrder, getRazorpayKey, verifyAndCreateOrder } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get('/get-key',protect,getRazorpayKey);
router.post('/create-order',protect,createOrder);
router.post('/verify',protect,verifyAndCreateOrder)

export default router;