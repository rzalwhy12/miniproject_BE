import { ErrorMsg } from "../constants/errorMessage.enum";
import { StatusCode } from "../constants/statusCode.enum";
import { IDataEvent } from "../dto/req/eventReq.dto";
import AppError from "../errors/AppError";
import eventRepository from "../repositories/event.repository";

export class EventService {
  private eventRepository = new eventRepository();

  public createEventService = async (
    dataEvent: IDataEvent,
    organizerId: number
  ) => {
    const organizer = await this.eventRepository.isHaveBankAccount(organizerId);
    if (
      !organizer?.bankName ||
      !organizer?.accountHolder ||
      !organizer.bankAccount
    ) {
      throw new AppError(
        "Organizer Must Have Bank Account",
        StatusCode.BAD_REQUEST
      );
    }

    const created = await this.eventRepository.createEventRepo(
      dataEvent,
      organizerId
    );
    if (!created) {
      throw new AppError(
        ErrorMsg.FAILD_CREATE_EVENT,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return created;
  };
  public updateEventService = async (
    eventId: number,
    dataEvent: IDataEvent
  ) => {
    const updatedEvent = await this.eventRepository.updateEventRepo(
      eventId,
      dataEvent
    );

    if (!updatedEvent) {
      throw new AppError(
        ErrorMsg.FAILD_CREATE_EVENT,
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    return updatedEvent;
  };
}
