"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const uploader_1 = require("../middleware/uploader");
const event_validator_1 = __importDefault(require("../middleware/validations/event.validator"));
const event_controller_1 = __importDefault(require("../controllers/event.controller"));
const reporting_controller_1 = __importDefault(require("../controllers/reporting.controller"));
class EventRouter {
    //end middleware deklarasi
    constructor() {
        //start kontroler deklarasi
        this.eventController = new event_controller_1.default();
        this.reportingController = new reporting_controller_1.default();
        //end controller deklarasi
        //start middleware deklarasi
        this.eventValidator = new event_validator_1.default();
        this.initializeRouter = () => {
            this.route.get("/", this.eventController.getEvent); // Get all events
            this.route.get("/:slug", this.eventController.getEvent); // Get event by slug
            this.route.get("/transaction-event", this.eventController.getTransactionEvent);
            this.route.use(verifyToken_1.verifyToken); //semua yang perlu verifyToken dibawah sini
            this.route.get("/my-event", this.eventController.getMyEvent); // This must come before /:eventId
            this.route.get("/:eventId", this.eventController.getEvent); // Get event by ID
            this.route.post("/create", this.eventValidator.createEventValidator, this.eventController.createEvent);
            //route upload banner dipakai barengan sama create atau update
            this.route.patch("/banner/:eventId", (0, uploader_1.uploadMemory)().single("banner"), this.eventController.uploadBanner);
            this.route.patch("/update/:eventId", this.eventValidator.createEventValidator, this.eventController.updateEvent);
            this.route.delete("/delete/:eventId", this.eventController.deleteEvent);
            this.route.get("/edit/:slug", this.eventController.getEditEvent);
            this.route.get("/my-event/:status", this.eventController.getMyEvent);
        };
        this.getRouter = () => {
            return this.route;
        };
        //inisialisasi
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = EventRouter;
