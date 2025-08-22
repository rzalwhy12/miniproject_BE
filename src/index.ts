import App from "./app";
import dotenv from "dotenv";
dotenv.config();

const app = new App();

// For Vercel serverless deployment
export default app.app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.start();
}
