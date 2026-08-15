import { Router } from "express";
import { signupValidator, loginValidator } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import { signupController, loginController } from "../controllers/authController.js";
import { forgotPasswordController, resetPasswordController } from "../controllers/userController.js";
import { forgotPasswordValidator, resetPasswordValidator } from "../validators/userValidator.js";

const router = Router();

router.post('/signup', signupValidator, validate, signupController);
router.post('/login', loginValidator, validate, loginController);


router.post('/forgot-password', forgotPasswordValidator, validate, forgotPasswordController);
router.post('/reset-password', resetPasswordValidator, validate, resetPasswordController);

export default router;