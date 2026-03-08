import { Router } from "express";
import {
    saveUser,
    addExtraAccount,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "./users.controller.js";
import { validateSaveUser, validateUpdateUser, validateUserId } from '../../middlewares/users-validator.js'

const router = Router();

//rutas para el Admin
router.post("/save", validateSaveUser, saveUser);         // Crear cliente y cuenta
router.post("/addaccount", addExtraAccount);     //Crearle otra cuenta al usuario
router.get("/", getUsers);             // Listar todos
router.get("/:id", validateUserId, getUserById);       // Ver uno solo
router.put("/update/:id", validateUpdateUser, updateUser); // Actualizar datos
router.delete("/delete/:id", deleteUser); // Desactivación lógica

export default router;