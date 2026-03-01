import { Router } from "express";
import {
    saveUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "./users.controller.js";

const router = Router();

//rutas para el Admin
router.post("/save", saveUser);         // Crear cliente y cuenta
router.get("/", getUsers);             // Listar todos
router.get("/:id", getUserById);       // Ver uno solo
router.put("/update/:id", updateUser); // Actualizar datos
router.delete("/delete/:id", deleteUser); // Desactivación lógica

export default router;