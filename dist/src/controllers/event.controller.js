"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const event_services_1 = require("../services/event.services");
const SendResSuccess_1 = require("../utils/SendResSuccess");
const successMessage_enum_1 = require("../constants/successMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const client_1 = require("../../prisma/generated/client");
const AppError_1 = __importDefault(require("../errors/AppError"));
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const cloudinary_1 = require("../config/cloudinary");
const event_repository_1 = __importDefault(require("../repositories/event.repository"));
const event_mapper_1 = require("../mappers/event.mapper");
class EventConttroller {
    constructor() {
        this.getTransactionEvent = async (req, res, next) => {
            try {
                const events = await this.eventService.getTransactionEvent();
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, events);
            }
            catch (error) {
                next(error);
            }
        };
        this.eventService = new event_services_1.EventService();
        this.eventRepository = new event_repository_1.default();
        //define method
        this.createEvent = async (req, res, next) => {
            try {
                if (res.locals.decript.activeRole !== client_1.RoleName.ORGANIZER) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.MUST_BE_ORGANIZER, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const organizerId = res.locals.decript.id;
                const event = await this.eventService.createEventService({ ...req.body }, organizerId);
                console.log(event);
                if (!event) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.FAILD_CREATE_EVENT, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                if (event) {
                    (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, (0, event_mapper_1.mapEventToRes)(event));
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.uploadBanner = async (req, res, next) => {
            try {
                if (res.locals.decript.activeRole !== client_1.RoleName.ORGANIZER) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.MUST_BE_ORGANIZER, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                let upload;
                if (req.file) {
                    upload = await (0, cloudinary_1.cloudinaryUpload)(req.file);
                }
                if (!upload) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.INTERNAL_SERVER_ERROR, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                const event = await this.eventRepository.uploadBanner(parseInt(req.params.eventId), upload?.secure_url);
                if (!event) {
                    throw new AppError_1.default("Failed to upload banner", statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
                }
                if (event) {
                    (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK);
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.updateEvent = async (req, res, next) => {
            try {
                if (res.locals.decript.activeRole !== client_1.RoleName.ORGANIZER) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.MUST_BE_ORGANIZER, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const eventId = parseInt(req.params.eventId);
                const organizerId = res.locals.decript.id;
                const isOwner = await this.eventRepository.isOwnerEvent(organizerId, eventId);
                if (!isOwner) {
                    throw new AppError_1.default('"your not the owner"', statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                if (isNaN(eventId)) {
                    throw new AppError_1.default("Invalid event ID", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const updatedEventData = {
                    ...req.body,
                };
                const result = await this.eventRepository.updateEventRepo(eventId, updatedEventData);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteEvent = async (req, res, next) => {
            try {
                if (res.locals.decript.activeRole !== client_1.RoleName.ORGANIZER) {
                    throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.MUST_BE_ORGANIZER, statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                const eventId = parseInt(req.params.eventId);
                const organizerId = res.locals.decript.id;
                const isOwner = await this.eventRepository.isOwnerEvent(organizerId, eventId);
                if (!isOwner) {
                    throw new AppError_1.default("your not the owner", statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                if (isNaN(eventId)) {
                    throw new AppError_1.default("Invalid event ID", statusCode_enum_1.StatusCode.BAD_REQUEST);
                }
                const result = await this.eventRepository.deleteEvent(eventId);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, result);
            }
            catch (error) {
                next(error);
            }
        };
        this.getMyEvent = async (req, res, next) => {
            try {
                const organizerId = res.locals.decript.id;
                const status = req.params.status;
                const myEvent = await this.eventService.myEvent(organizerId, status);
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, myEvent);
            }
            catch (error) {
                next(error);
            }
        };
        this.getEvent = async (req, res, next) => {
            try {
                const { eventId, slug } = req.params;
                const { page = 1, limit = 10 } = req.query;
                // If neither eventId nor slug is provided, get all events
                if (!eventId && !slug) {
                    const events = await this.eventService.getAllEvents();
                    return (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, events);
                }
                // If eventId is provided, get event by ID
                if (eventId) {
                    const eventIdNum = parseInt(eventId);
                    if (isNaN(eventIdNum)) {
                        throw new AppError_1.default("Invalid event ID", statusCode_enum_1.StatusCode.BAD_REQUEST);
                    }
                    const event = await this.eventService.getEventById(eventIdNum);
                    return (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, (0, event_mapper_1.mapEventToRes)(event));
                }
                // If slug is provided, get event by slug
                if (slug) {
                    const event = await this.eventService.getEventBySlug(slug);
                    return (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, (0, event_mapper_1.mapEventToRes)(event));
                }
            }
            catch (error) {
                next(error);
            }
        };
        this.getEditEvent = async (req, res, next) => {
            try {
                const userId = res.locals.decript.id;
                const slug = req.params.slug;
                const event = await this.eventRepository.getEditEvent(slug);
                if (!event) {
                    throw new AppError_1.default("Event not found", statusCode_enum_1.StatusCode.NOT_FOUND);
                }
                if (event.organizerId !== userId) {
                    throw new AppError_1.default("You're not the owner", statusCode_enum_1.StatusCode.UNAUTHORIZED);
                }
                (0, SendResSuccess_1.sendResSuccess)(res, successMessage_enum_1.SuccessMsg.OK, statusCode_enum_1.StatusCode.OK, (0, event_mapper_1.mapEditEventToRes)(event));
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.default = EventConttroller;
