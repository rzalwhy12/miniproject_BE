import { Event } from "../../prisma/generated/client";

export const mapEventToRes = (event: Event) => {
  return {
    id: event.id,
  };
};
