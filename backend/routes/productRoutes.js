import { Router } from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createProductValidator, getAllProductsValidator, productIdValidator, updateProductValidator } from "../validators/productValidator.js";
import { createProductController, deleteProductController, getAllProductsController, getProductByIdController, updateProductController } from "../controllers/productController.js";
import { validate } from "../middleware/validate.js";

const router = Router();

router.post("/", protect, isAdmin, createProductValidator, validate, createProductController);
router.get("/", getAllProductsValidator, validate, getAllProductsController);
router.get("/:id", protect, isAdmin, productIdValidator, validate, getProductByIdController);
router.patch("/:id", protect, isAdmin, productIdValidator, updateProductValidator,validate, updateProductController);
router.delete("/:id", protect, isAdmin, productIdValidator, validate, deleteProductController);

export default router;