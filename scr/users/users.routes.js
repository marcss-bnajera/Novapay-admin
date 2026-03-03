import { Router } from "express";
import {
    saveUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "./users.controller.js";
import { validateSaveUser, validateUpdateUser, validateUserId } from '../../middlewares/users-validator.js'

const router = Router();

//rutas para el Admin
router.post("/save", saveUser, validateSaveUser);         // Crear cliente y cuenta
router.get("/", getUsers);             // Listar todos
router.get("/:id", getUserById, validateUserId);       // Ver uno solo
router.put("/update/:id", updateUser, validateUpdateUser); // Actualizar datos
router.delete("/delete/:id", deleteUser); // Desactivación lógica

export default router;