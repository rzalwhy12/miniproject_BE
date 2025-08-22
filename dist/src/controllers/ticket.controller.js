"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_service_1 = __importDefault(require("../services/ticket.service"));
const SendResSuccess_1 = require("../utils/SendResSuccess");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const successMessage_enum_1 = require("../constants/successMessage.enum");
const AppError_1 = __importDefault(require("../errors/AppError"));
class TicketController {
    constructor() {
        this.getTicketById = async (req, res, next) => {
            try {
                const ticketTypeId = parseInt(req.params.ticketTypeId);
                if (isNaN(ticketTypeId)) {
                    throw new AppError_1.default("Invalid ticketTypeId", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const ticket = await ticket_service_1.default.getTicketById(ticketTypeId);
                if (!ticket) {
                    throw new AppError_1.default("Ticket not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, ticket);
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = TicketController;
