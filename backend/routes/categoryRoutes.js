import { Router } from "express";
import { createCategoryValidator, updateCategoryValidator, categoryIdValidator } from "../validators/categoryValidator.js";
import { validate } from "../middleware/validate.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { createCategoryController, getAllCategoryController, getCategoryByIdController, updateCategoryController, deleteCategoryController } from "../controllers/categoryController.js";

const router = Router();

router.post('/', protect, isAdmin, createCategoryValidator, validate, createCategoryController);
router.get('/', getAllCategoryController);
router.get('/:id', protect, isAdmin, categoryIdValidator, validate, getCategoryByIdController);
router.patch('/:id', protect, isAdmin, categoryIdValidator, updateCategoryValidator, validate, updateCategoryController);
router.delete('/:id', protect, isAdmin, categoryIdValidator, validate, deleteCategoryController);

export default router;