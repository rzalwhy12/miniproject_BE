import App from "./app";

// Create instance of App
const app = new App();

// For local development
if (process.env.NODE_ENV !== 'production') {
  app.start();
}

// Export Express instance for Vercel
export default app.app;
