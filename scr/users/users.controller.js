`use strict`

import { User } from "./users.model.js";


// Funciones de administrador

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json({
            success: true,
            total: users.length,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener usuarios",
            error: error.message
        });
    }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar el usuario",
            error: error.message
        });
    }
};

// Actualizar usuario
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userData = req.body;

        const [affectedCount] = await User.update(userData, {
            where: { id }
        });

        if (affectedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado o no hubo cambios"
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario actualizado exitosamente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar usuario",
            error: error.message
        });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const deleteRows = await User.destroy({
            where: { id }
        });

        if (deleteRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado"
            });
        }

        res.status(200).json({
            success: true,
            message: "Usuario eliminado permanentemente"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el usuario",
            error: error.message
        });
    }
};