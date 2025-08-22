import App from "./app";

const PORT: string = process.env.PORT || "8181";
const appInstance = new App();
const app = appInstance.app;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});