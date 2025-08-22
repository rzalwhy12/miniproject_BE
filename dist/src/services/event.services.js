"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const errorMessage_enum_1 = require("../constants/errorMessage.enum");
const statusCode_enum_1 = require("../constants/statusCode.enum");
const AppError_1 = __importDefault(require("../errors/AppError"));
const event_repository_1 = __importDefault(require("../repositories/event.repository"));
class EventService {
    constructor() {
        this.getTransactionEvent = async () => {
            return await this.eventRepository.getTransactionEvent();
        };
        this.eventRepository = new event_repository_1.default();
        this.createEventService = async (dataEvent, organizerId) => {
            const organizer = await this.eventRepository.isHaveBankAccount(organizerId);
            if (!organizer?.bankName ||
                !organizer?.accountHolder ||
                !organizer.bankAccount) {
                throw new AppError_1.default("Organizer Must Have Bank Account", statusCode_enum_1.StatusCode.BAD_REQUEST);
            }
            const created = await this.eventRepository.createEventRepo(dataEvent, organizerId);
            if (!created) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.FAILD_CREATE_EVENT, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
            }
            return created;
        };
        this.updateEventService = async (eventId, dataEvent) => {
            const updatedEvent = await this.eventRepository.updateEventRepo(eventId, dataEvent);
            if (!updatedEvent) {
                throw new AppError_1.default(errorMessage_enum_1.ErrorMsg.FAILD_CREATE_EVENT, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
            }
            return updatedEvent;
        };
        this.myEvent = async (organizerId, status) => {
            return await this.eventRepository.findMyEvent(organizerId, status);
        };
        this.getAllEvents = async () => {
            return await this.eventRepository.findAllEvents();
        };
        this.getEventById = async (eventId) => {
            const event = await this.eventRepository.findEventById(eventId);
            if (!event) {
                throw new AppError_1.default("Event not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            return event;
        };
        this.getEventBySlug = async (slug) => {
            const event = await this.eventRepository.findEventBySlug(slug);
            if (!event) {
                throw new AppError_1.default("Event not found", statusCode_enum_1.StatusCode.NOT_FOUND);
            }
            return event;
        };
    }
}
exports.EventService = EventService;
