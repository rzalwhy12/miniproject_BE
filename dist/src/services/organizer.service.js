"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchOrganizers = void 0;
const organizer_repository_1 = require("../repositories/organizer.repository");
const fetchOrganizers = async () => {
    return await (0, organizer_repository_1.getOrganizers)();
};
exports.fetchOrganizers = fetchOrganizers;
