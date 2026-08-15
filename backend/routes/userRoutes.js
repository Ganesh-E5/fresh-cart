import { Router } from "express";
import { protect, isAdmin } from "../middleware/authMiddleware.js";
import { getAllUsersValidator, userIdValidator,updateProfileValidator,changePasswordValidator,addAddressValidator,updateAddressValidator,addressIdValidator } from "../validators/userValidator.js";
import { validate } from "../middleware/validate.js";
import { getAllUsersController, getUserByIdController,getProfileController,updateProfileController,changePasswordController,getAddressesController,addAddressController,updateAddressController,deleteAddressController } from "../controllers/userController.js";

const router = Router();

router.get("/me", protect, getProfileController);
router.patch("/me", protect, updateProfileValidator, validate, updateProfileController);
router.patch("/me/password", protect, changePasswordValidator, validate, changePasswordController);

router.get("/me/addresses", protect, getAddressesController);
router.post("/me/addresses", protect, addAddressValidator, validate, addAddressController);
router.patch("/me/addresses/:addressId", protect, updateAddressValidator, validate, updateAddressController);
router.delete("/me/addresses/:addressId", protect, addressIdValidator, validate, deleteAddressController);

router.get("/", protect, isAdmin, getAllUsersValidator, validate, getAllUsersController);
router.get("/:id", protect, isAdmin, userIdValidator, validate, getUserByIdController);

export default router;