"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verifyToken_1 = require("../middleware/verifyToken");
const event_validator_1 = __importDefault(require("../middleware/validations/event.validator"));
const event_controller_1 = __importDefault(require("../controllers/event.controller"));
const reporting_controller_1 = __importDefault(require("../controllers/reporting.controller"));
class ReportingRouter {
    //end middleware deklarasi
    constructor() {
        //start kontroler deklarasi
        this.eventController = new event_controller_1.default();
        this.reportingController = new reporting_controller_1.default();
        //end controller deklarasi
        //start middleware deklarasi
        this.eventValidator = new event_validator_1.default();
        this.initializeRouter = () => {
            this.route.use(verifyToken_1.verifyToken); //semua yang perlu verifyToken dibawah sini
            this.route.get("/reporting/:slug", this.reportingController.reporting);
            this.route.get("/all", this.reportingController.reportingAll); // Data mingguan
        };
        this.getRouter = () => {
            return this.route;
        };
        //inisialisasi
        this.route = (0, express_1.Router)();
        this.initializeRouter();
    }
}
exports.default = ReportingRouter;
