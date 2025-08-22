import App from "./app";
import dotenv from "dotenv";
dotenv.config();

// Create instance of App
const app = new App();

// For Vercel, we export the Express app
const handler = app.app;

// Start the server if we're running locally
if (!process.env.VERCEL) {
  app.start();
}

export default handler;
