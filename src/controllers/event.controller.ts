import { NextFunction, Request, Response } from "express";
import { EventService } from "../services/event.services";
import { sendResSuccess } from "../utils/SendResSuccess";
import { SuccessMsg } from "../constants/successMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { RoleName } from "../../prisma/generated/client";
import AppError from "../errors/AppError";
import { ErrorMsg } from "../constants/errorMessage.enum";
import { UploadApiResponse } from "cloudinary";
import { cloudinaryUpload } from "../config/cloudinary";
import EventRepository from "../repositories/event.repository";

class EventConttroller {
  private eventService = new EventService();
  private eventRepository = new EventRepository();
  //define method
  public createEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (res.locals.decript.activeRole !== RoleName.ORGANIZER) {
        throw new AppError(ErrorMsg.MUST_BE_ORGANIZER, StatusCode.UNAUTHORIZED);
      }
      let upload: UploadApiResponse | undefined;
      if (req.file) {
        upload = await cloudinaryUpload(req.file);
      }
      const organizerId = res.locals.decript.id;
      const event = await this.eventService.createEventService(
        { ...req.body, banner: upload?.secure_url },
        organizerId
      );
      console.log(event);
      if (!event) {
        throw new AppError(
          ErrorMsg.FAILD_CREATE_EVENT,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      if (event) {
        sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
      }
    } catch (error) {
      next(error);
    }
  };
  public uploadBanner = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (res.locals.decript.activeRole !== RoleName.ORGANIZER) {
        throw new AppError(ErrorMsg.MUST_BE_ORGANIZER, StatusCode.UNAUTHORIZED);
      }
      let upload: UploadApiResponse | undefined;
      if (req.file) {
        upload = await cloudinaryUpload(req.file);
      }
      if (!upload) {
        throw new AppError(
          ErrorMsg.INTERNAL_SERVER_ERROR,
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }
      const event = await this.eventRepository.uploadBanner(
        parseInt(req.params.eventId),
        upload?.secure_url
      );
      if (!event) {
        throw new AppError(
          "Failed to upload banner",
          StatusCode.INTERNAL_SERVER_ERROR
        );
      }

      if (event) {
        sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
      }
    } catch (error) {}
  };
  public updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK);
    } catch (error) {
      next(error);
    }
  };
}

export default EventConttroller;
