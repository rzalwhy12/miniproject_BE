"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = generateSlug;
const slugify_1 = __importDefault(require("slugify"));
function generateSlug(text) {
    const timestamp = Date.now();
    return (0, slugify_1.default)(`${text}-${timestamp}`, {
        lower: true,
        strict: true, // buang karakter aneh
        trim: true,
    });
}
