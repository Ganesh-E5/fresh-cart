import { Router } from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import {
    checkOutValidator,
    getAllOrdersValidator,
    orderIdValidator,
    updateOrderStatusValidator,
} from "../validators/orderValidator.js";
import { validate } from "../middleware/validate.js";
import {
    checkOutController,
    getAllOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
    getAllOrdersAdminController,
} from "../controllers/orderController.js";

const router = Router();

router.post("/", protect, checkOutValidator, validate, checkOutController);
router.get("/", protect, getAllOrdersValidator, validate, getAllOrdersController);

router.get("/admin/all", protect, isAdmin, getAllOrdersValidator, validate, getAllOrdersAdminController);

router.get("/:id", protect, orderIdValidator, validate, getOrderByIdController);
router.patch("/:id", protect, isAdmin, orderIdValidator, updateOrderStatusValidator, validate, updateOrderStatusController);

export default router;