"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = require("../config/nodemailer");
const sendEmail = async (userEmail, subject, html) => {
    await nodemailer_1.transport.sendMail({
        from: process.env.MAILSENDER,
        to: userEmail,
        subject,
        html,
    });
};
exports.sendEmail = sendEmail;
