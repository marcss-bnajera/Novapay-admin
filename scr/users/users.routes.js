`use strict`

import { Router } from "express";
import {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
} from "./users.controller.js";

const router = Router();

// Rutas de administrador
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;