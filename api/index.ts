import App from "../src/app";
import { Application } from "express";

// Membuat instance dari App
const appInstance = new App();

// Mengekspor instance Express app untuk Vercel
const app: Application = appInstance.app;
export default app;