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
import { mapEventToRes } from "../mappers/event.mapper";

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

      const organizerId = res.locals.decript.id;
      const event = await this.eventService.createEventService(
        { ...req.body },
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
        sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, mapEventToRes(event));
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
    } catch (error) {
      next(error);
    }
  };
  public updateEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (res.locals.decript.activeRole !== RoleName.ORGANIZER) {
        throw new AppError(ErrorMsg.MUST_BE_ORGANIZER, StatusCode.UNAUTHORIZED);
      }

      const eventId = parseInt(req.params.eventId);
      const organizerId = res.locals.decript.id;

      const isOwner = await this.eventRepository.isOwnerEvent(
        organizerId,
        eventId
      );

      if (!isOwner) {
        throw new AppError("your not the owner", StatusCode.UNAUTHORIZED);
      }

      if (isNaN(eventId)) {
        throw new AppError("Invalid event ID", StatusCode.BAD_REQUEST);
      }

      const updatedEventData = {
        ...req.body,
      };

      const result = await this.eventRepository.updateEventRepo(
        eventId,
        updatedEventData
      );

      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, result);
    } catch (error) {
      next(error);
    }
  };
  public deleteEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (res.locals.decript.activeRole !== RoleName.ORGANIZER) {
        throw new AppError(ErrorMsg.MUST_BE_ORGANIZER, StatusCode.UNAUTHORIZED);
      }

      const eventId = parseInt(req.params.eventId);
      const organizerId = res.locals.decript.id;

      const isOwner = await this.eventRepository.isOwnerEvent(
        organizerId,
        eventId
      );

      if (!isOwner) {
        throw new AppError("your not the owner", StatusCode.UNAUTHORIZED);
      }

      if (isNaN(eventId)) {
        throw new AppError("Invalid event ID", StatusCode.BAD_REQUEST);
      }

      const result = await this.eventRepository.deleteEvent(eventId);

      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, result);
    } catch (error) {
      next(error);
    }
  };
  public getMyEvent = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const organizerId = res.locals.decript.id;
      const status = req.params.status;
      const myEvent = await this.eventService.myEvent(organizerId, status);
      sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, myEvent);
    } catch (error) {
      next(error);
    }
  };

  public getEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eventId, slug } = req.params;
      const { page = 1, limit = 10 } = req.query;

      // If neither eventId nor slug is provided, get all events
      if (!eventId && !slug) {
        const events = await this.eventService.getAllEvents();
        return sendResSuccess(res, SuccessMsg.OK, StatusCode.OK, events);
      }

      // If eventId is provided, get event by ID
      if (eventId) {
        const eventIdNum = parseInt(eventId);
        if (isNaN(eventIdNum)) {
          throw new AppError("Invalid event ID", StatusCode.BAD_REQUEST);
        }
        const event = await this.eventService.getEventById(eventIdNum);
        return sendResSuccess(
          res,
          SuccessMsg.OK,
          StatusCode.OK,
          mapEventToRes(event)
        );
      }

      // If slug is provided, get event by slug
      if (slug) {
        const event = await this.eventService.getEventBySlug(slug);
        return sendResSuccess(
          res,
          SuccessMsg.OK,
          StatusCode.OK,
          mapEventToRes(event)
        );
      }
    } catch (error) {
      next(error);
    }
  };
}

export default EventConttroller;
