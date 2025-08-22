"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
// Membuat instance dari App
const appInstance = new app_1.default();
// Mengekspor instance Express app untuk Vercel
const app = appInstance.app;
exports.default = app;
