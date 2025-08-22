"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = new app_1.default();
// For Vercel serverless deployment
exports.default = app.app;
// For local development
if (process.env.NODE_ENV !== 'production') {
    app.start();
}
