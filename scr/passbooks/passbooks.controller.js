'use strict'

import { Passbook } from "./passbooks.model.js";

const generatePassbookNumber = () => {
    let number = '';
    for (let i = 0; i < 12; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

export const createPassbook = async (req, res) => {
    try {

        const { account_id } = req.body;

        const passbook = await Passbook.create({
            numero_libreta: generatePassbookNumber(),
            account_id
        });

        return res.status(201).json({
            success: true,
            message: "Libreta creada correctamente",
            passbook
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating passbook",
            error: error.message
        });
    }
}

export const getPassbookByAccount = async (req, res) => {
    try {
        const { id } = req.params;
        const passbook = await Passbook.findOne({
            where: { account_id: id }
        });

        return res.status(200).json({
            success: true,
            passbook
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching passbook",
            error: error.message
        });
    }
}