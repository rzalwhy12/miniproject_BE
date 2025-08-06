
import { Request, Response, NextFunction } from "express";
import voucherService from "../services/voucher.service";
import { sendResSuccess } from "../utils/SendResSuccess";
import { StatusCode } from "../constants/statusCode.enum";
import { SuccessMsg } from "../constants/successMessage.enum";
import AppError from "../errors/AppError";

class VoucherController {
    public applyVoucher = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { eventId, voucherCode } = req.body;
            if (!eventId || !voucherCode) {
                throw new AppError("eventId and voucherCode are required", StatusCode.BAD_REQUEST);
            }
            const result = await voucherService.applyVoucher(eventId, voucherCode);
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, result);
        } catch (error) {
            next(error);
        }
    };

    public getVouchers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId = req.query.eventId ? parseInt(req.query.eventId as string) : undefined;
            const vouchers = await voucherService.getVouchers(eventId);
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, vouchers);
        } catch (error) {
            next(error);
        }
    };

    public getVouchersByEventId = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId = parseInt(req.params.eventId);
            if (isNaN(eventId)) {
                throw new AppError("Invalid eventId", StatusCode.BAD_REQUEST);
            }
            const vouchers = await voucherService.getVouchersByEventId(eventId);
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, vouchers);
        } catch (error) {
            next(error);
        }
    };

    public getVouchersByEventID = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId = parseInt(req.params.eventId);
            if (isNaN(eventId)) {
                throw new AppError("Invalid eventId", StatusCode.BAD_REQUEST);
            }
            const vouchers = await voucherService.getVouchersByEventId(eventId);
            sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, vouchers);
        } catch (error) {
            next(error);
        }
    };
}

export default VoucherController;
