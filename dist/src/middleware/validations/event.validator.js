"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const client_1 = require("../../../prisma/generated/client");
const validationHandler_1 = require("../validationHandler/validationHandler");
class EventValidator {
    constructor() {
        this.createEventValidator = [
            // Nama Event
            (0, express_validator_1.body)("name").notEmpty().withMessage("Event name is required"),
            // Deskripsi
            (0, express_validator_1.body)("description")
                .optional()
                .isString()
                .withMessage("Description must be a string"),
            // Syarat dan Ketentuan
            (0, express_validator_1.body)("syaratKetentuan")
                .optional()
                .isString()
                .withMessage("Syarat & Ketentuan must be a string"),
            // Tanggal mulai
            (0, express_validator_1.body)("startDate")
                .notEmpty()
                .withMessage("Start date is required")
                .isISO8601()
                .toDate(),
            // Tanggal selesai
            (0, express_validator_1.body)("endDate")
                .notEmpty()
                .withMessage("End date is required")
                .isISO8601()
                .toDate(),
            // Lokasi
            (0, express_validator_1.body)("location").notEmpty().withMessage("Location is required"),
            // Kategori
            (0, express_validator_1.body)("category")
                .notEmpty()
                .withMessage("Category is required")
                .isIn(Object.values(client_1.EventCategory))
                .withMessage("Invalid category"),
            // Status event
            (0, express_validator_1.body)("eventStatus")
                .notEmpty()
                .withMessage("Event status is required")
                .isIn(Object.values(client_1.EventStatus))
                .withMessage("Invalid event status"),
            // Ticket Types (Array)
            (0, express_validator_1.body)("ticketTypes")
                .isArray({ min: 1 })
                .withMessage("Ticket types must be a non-empty array"),
            (0, express_validator_1.body)("ticketTypes.*.name")
                .notEmpty()
                .withMessage("Ticket name is required"),
            (0, express_validator_1.body)("ticketTypes.*.price")
                .isInt({ min: 0 })
                .withMessage("Ticket price must be a positive number"),
            (0, express_validator_1.body)("ticketTypes.*.quota")
                .isInt({ min: 1 })
                .withMessage("Quota must be at least 1"),
            (0, express_validator_1.body)("ticketTypes.*.descriptionTicket")
                .isString()
                .withMessage("Ticket description must be a string"),
            (0, express_validator_1.body)("ticketTypes.*.benefit")
                .isString()
                .withMessage("Ticket benefit must be a string"),
            (0, express_validator_1.body)("vouchers")
                .optional()
                .isArray()
                .withMessage("Vouchers must be an array"),
            (0, express_validator_1.body)("vouchers.*.discount")
                .optional()
                .isInt({ min: 0 })
                .withMessage("Discount must be a non-negative integer"),
            (0, express_validator_1.body)("vouchers.*.startDate")
                .optional()
                .isISO8601()
                .withMessage("Start date must be a valid ISO8601 date")
                .toDate(),
            (0, express_validator_1.body)("vouchers.*.endDate")
                .optional()
                .isISO8601()
                .withMessage("End date must be a valid ISO8601 date")
                .toDate(),
            (0, express_validator_1.body)("vouchers.*.status")
                .optional()
                .isIn(Object.values(client_1.VoucherStatus))
                .withMessage("Invalid voucher status"),
            validationHandler_1.validationHandler,
        ];
    }
}
exports.default = EventValidator;
