`use strict`

import { Role } from "./roles.model.js"

// Funciones de administrador

// Obtener todos los roles (GET)
export const getRoles = async (req, res) => {
    try {
        const roles = await Role.findAll();
        res.status(200).json({
            success: true,
            total: roles.length,
            roles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener roles",
            error: error.message
        });
    }
};

// Obtener rol por ID (GET)
export const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByPk(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Rol no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            role
        });
    } catch (error) {
        res.status(500).json({
            succes: false,
            message: "Error al buscar el rol",
            error: error.message
        })
    }
}

// Crear (POST)
export const createRole = async (req, res) => {
    try {
        const { name } = req.body;

        const role = await Role.create({ name });

        res.status(201).json({
            success: true,
            message: "Rol creado"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el rol",
            error: error.message
        });
    }
};

// Actualizar (PUT)
export const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        //Actualizamos
        const { updateRows } = await Role.update(
            { name },
            { where: { id } }
        );

        if (updateRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Rol no encontrado o no hubo cambios"
            });
        }

        res.status(200).json({
            success: true,
            message: "Rol actualizado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar ",
            error: error.message
        });
    }
};

// Eliminar (DELETE)
export const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteRows = await Role.destroy({
            where: { id }
        });

        if (deleteRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Rol no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Rol eliminado permanentemente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el rol",
            error: error.message
        });
    }
}