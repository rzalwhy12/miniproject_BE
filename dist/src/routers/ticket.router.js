"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ticket_controller_1 = __importDefault(require("../controllers/ticket.controller"));
class TicketRouter {
    constructor() {
        this.ticketController = new ticket_controller_1.default();
        this.initializeRouter = () => {
            this.route.get("/:ticketTypeId", this.ticketController.getTicketById);
        };
        this.getRouter = () => {
            return this.route;
        };
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = TicketRouter;
