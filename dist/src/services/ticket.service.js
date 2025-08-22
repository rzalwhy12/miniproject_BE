"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ticket_repository_1 = __importDefault(require("../repositories/ticket.repository"));
class TicketService {
    async getTicketById(ticketTypeId) {
        return await ticket_repository_1.default.getTicketById(ticketTypeId);
    }
}
exports.default = new TicketService();
