import { Router } from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js"
import { validate } from "../middleware/validate.js";
import { createProductVariantValidator, getAllProductsVariantValidator, productVariantIdValidator, updateProductVariantValidator } from "../validators/productVariantValidator.js";
import { createProductVariantController, getAllProductsVariantController, getProductVariantByIdController, updateProductVariantController, deleteProductVariantController } from "../controllers/productVariantController.js";

const router = Router();

router.post('/', protect, isAdmin, createProductVariantValidator, validate, createProductVariantController);
router.get('/', getAllProductsVariantValidator, validate, getAllProductsVariantController);
router.get('/:id', productVariantIdValidator, validate, getProductVariantByIdController);
router.patch('/:id', protect, isAdmin, productVariantIdValidator, updateProductVariantValidator, validate, updateProductVariantController);
router.delete('/:id', protect, isAdmin, productVariantIdValidator, deleteProductVariantController);

export default router;