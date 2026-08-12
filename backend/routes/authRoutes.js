import { Router } from "express";
import { signupValidator, loginValidator } from "../validators/authValidator.js";
import { validate } from "../middleware/validate.js";
import { signupController, loginController } from "../controllers/authController.js";

const router = Router();

router.post('/signup', signupValidator, validate, signupController);
router.post('/login', loginValidator, validate, loginController);

export default router;