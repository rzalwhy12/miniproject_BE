import { Request, Response, NextFunction } from "express";
import ticketService from "../services/ticket.service";
import { sendResSuccess } from "../utils/SendResSuccess";
import { StatusCode } from "../constants/statusCode.enum";
import { SuccessMsg } from "../constants/successMessage.enum";
import AppError from "../errors/AppError";

class TicketController {
    public getTicketById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const ticketTypeId = parseInt(req.params.ticketTypeId);
            if (isNaN(ticketTypeId)) {
                throw new AppError("Invalid ticketTypeId", StatusCode.BAD_REQUEST);
            }
            const ticket = await ticketService.getTicketById(ticketTypeId);
            if (!ticket) {
                throw new AppError("Ticket not found", StatusCode.NOT_FOUND);
            }
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, ticket);
        } catch (error) {
            next(error);
        }
    };
}

export default TicketController;
