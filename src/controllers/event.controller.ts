import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/event.services";
import AppError from "../errors/AppError";
import { StatusCode } from "../constants/statusCode.enum";
import { cloudinaryUpload } from "../config/cloudinary";

const eventService = new EventService();

export class EventController {
  public create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Request body:", req.body);
      console.log("Request file:", req.file);
      console.log("Required fields check:");
      console.log("- name:", req.body.name);
      console.log("- startDate:", req.body.startDate);
      console.log("- endDate:", req.body.endDate);
      console.log("- location:", req.body.location);

      // Validate required fields (matching frontend)
      if (
        !req.body.name ||
        !req.body.startDate ||
        !req.body.endDate ||
        !req.body.location
      ) {
        console.log("Missing fields detected!");
        throw new AppError("Missing required fields", StatusCode.BAD_REQUEST);
      }

      // Handle image upload if present
      let imageUrl = null;
      if (req.file) {
        console.log(
          "Image file received:",
          req.file.originalname,
          req.file.size
        );
        try {
          const uploadResult = await cloudinaryUpload(req.file);
          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.error("Image upload failed:", error);
          // Continue without image
        }
      }

      // Parse tickets if it's a string
      let tickets = req.body.tickets;
      if (typeof tickets === "string") {
        try {
          tickets = JSON.parse(tickets);
        } catch (e) {
          console.error("Error parsing tickets:", e);
          tickets = [];
        }
      }

      // Create proper date objects from frontend format
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(req.body.endDate);

      // Validate dates
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new AppError("Invalid date format", StatusCode.BAD_REQUEST);
      }

      // Transform the request data to match your schema
      const eventData = {
        name: req.body.name.toString(),
        description: req.body.description || null,
        location: req.body.location.toString(),
        startDate: startDate,
        endDate: endDate,
        statusEvent: req.body.statusEvent || ("PUBLISHED" as const),
        category: req.body.category || ("LAINNYA" as const),
        organizerId: 1, // Default organizer ID since no auth
        syaratKetentuan:
          req.body.syaratKetentuan || "Syarat dan ketentuan berlaku",
        image: imageUrl,
      };

      console.log("Final event data:", eventData);

      const event = await eventService.createEvent(eventData);

      // Create ticket types if provided
      if (tickets && Array.isArray(tickets)) {
        console.log("Creating tickets:", tickets);
        await eventService.createTicketTypes(event.id, tickets);
      }

      res.status(201).json({
        success: true,
        message: "Event created successfully",
        data: event,
      });
    } catch (err) {
      console.error("Event creation error:", err);
      next(err);
    }
  };

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const event = await eventService.updateEvent(id, req.body);
      res.json({ success: true, data: event });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await eventService.deleteEvent(id);
      res.json({ success: true, message: "Event deleted" });
    } catch (err) {
      next(err);
    }
  }
}
