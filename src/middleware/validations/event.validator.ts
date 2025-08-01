import { body } from "express-validator";
import {
  EventCategory,
  EventStatus,
  VoucherStatus,
} from "../../../prisma/generated/client";
import { validationHandler } from "../validationHandler/validationHandler";

class EventValidator {
  public createEventValidator = [
    // Nama Event
    body("name").notEmpty().withMessage("Event name is required"),

    // Deskripsi
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string"),

    // Syarat dan Ketentuan
    body("syaratKetentuan")
      .optional()
      .isString()
      .withMessage("Syarat & Ketentuan must be a string"),

    // Tanggal mulai
    body("startDate")
      .notEmpty()
      .withMessage("Start date is required")
      .isISO8601()
      .toDate(),

    // Tanggal selesai
    body("endDate")
      .notEmpty()
      .withMessage("End date is required")
      .isISO8601()
      .toDate(),

    // Lokasi
    body("location").notEmpty().withMessage("Location is required"),

    // Kategori
    body("category")
      .notEmpty()
      .withMessage("Category is required")
      .isIn(Object.values(EventCategory))
      .withMessage("Invalid category"),

    // Status event
    body("eventStatus")
      .notEmpty()
      .withMessage("Event status is required")
      .isIn(Object.values(EventStatus))
      .withMessage("Invalid event status"),

    // Ticket Types (Array)
    body("ticketTypes")
      .optional()
      .isArray()
      .withMessage("Ticket types must be an array"),

    body("ticketTypes.*.name")
      .optional()
      .notEmpty()
      .withMessage("Ticket name is required"),

    body("ticketTypes.*.price")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Ticket price must be a positive number"),

    body("ticketTypes.*.quota")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Quota must be at least 1"),

    body("ticketTypes.*.descriptionTicket")
      .optional()
      .isString()
      .withMessage("Ticket description must be a string"),

    body("ticketTypes.*.benefit")
      .optional()
      .isString()
      .withMessage("Ticket benefit must be a string"),

    // ✅ Voucher (Array optional)
    body("vouchers")
      .optional()
      .isArray()
      .withMessage("Vouchers must be an array"),

    body("vouchers.*.discount")
      .optional()
      .isInt({ min: 0 })
      .withMessage("Discount must be a non-negative integer"),

    body("vouchers.*.startDate")
      .optional()
      .isISO8601()
      .withMessage("Start date must be a valid ISO8601 date")
      .toDate(),

    body("vouchers.*.endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid ISO8601 date")
      .toDate(),

    body("vouchers.*.status")
      .optional()
      .isIn(Object.values(VoucherStatus))
      .withMessage("Invalid voucher status"),

    validationHandler,
  ];
}

export default EventValidator;
