"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const organizer_controller_1 = require("../controllers/organizer.controller");
const router = (0, express_1.Router)();
router.get('/', organizer_controller_1.getOrganizerController);
exports.default = router;
