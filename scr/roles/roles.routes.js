import { Router } from "express";
import {
    getRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole
} from "./roles.controller.js";
import { validateCreateRole, validateUpdateRole, validateRoleId } from '../../middlewares/roles-validator.js'

const router = Router();

router.get('/', getRoles);
router.get('/:id', getRoleById, validateRoleId);
router.post('/', createRole, validateCreateRole);
router.put('/:id', updateRole, validateUpdateRole);
router.delete('/:id', deleteRole);

export default router;
