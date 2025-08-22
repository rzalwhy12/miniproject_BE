"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrganizerController = void 0;
const organizer_service_1 = require("../services/organizer.service");
const getOrganizerController = async (req, res) => {
    try {
        const organizers = await (0, organizer_service_1.fetchOrganizers)();
        res.status(200).json({ success: true, data: organizers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch organizers', error });
    }
};
exports.getOrganizerController = getOrganizerController;
