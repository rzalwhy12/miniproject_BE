"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_router_1 = __importDefault(require("./routers/auth.router"));
const AppError_1 = __importDefault(require("./errors/AppError"));
const statusCode_enum_1 = require("./constants/statusCode.enum");
const errorMessage_enum_1 = require("./constants/errorMessage.enum");
const client_1 = require("../prisma/generated/client");
const jsonwebtoken_1 = require("jsonwebtoken");
const account_router_1 = __importDefault(require("./routers/account.router"));
const event_router_1 = __importDefault(require("./routers/event.router"));
const transaction_router_1 = __importDefault(require("./routers/transaction.router"));
const review_router_1 = __importDefault(require("./routers/review.router"));
const voucher_router_1 = __importDefault(require("./routers/voucher.router"));
const ticket_router_1 = __importDefault(require("./routers/ticket.router"));
const reporting_router_1 = __importDefault(require("./routers/reporting.router"));
const PORT = process.env.PORT || "8181";
class App {
    constructor() {
        this.configure = () => {
            // Configure CORS for production
            this.app.use((0, cors_1.default)({
                origin: process.env.BASIC_URL_FE || "http://localhost:3000",
                methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
                credentials: true,
                allowedHeaders: ["Content-Type", "Authorization"]
            }));
            this.app.use(express_1.default.json());
            // Add security headers
            this.app.use((req, res, next) => {
                res.setHeader("X-Content-Type-Options", "nosniff");
                res.setHeader("X-Frame-Options", "DENY");
                res.setHeader("X-XSS-Protection", "1; mode=block");
                next();
            });
        };
        this.route = () => {
            const authrouter = new auth_router_1.default();
            const accountRouter = new account_router_1.default();
            const eventRouter = new event_router_1.default();
            const transaction = new transaction_router_1.default();
            const review = new review_router_1.default();
            const voucher = new voucher_router_1.default();
            const ticket = new ticket_router_1.default();
            const reportingRouter = new reporting_router_1.default();
            this.app.get("/", (req, res) => {
                res.status(200).send("<h1>Test Tiket Backend</h1>");
            });
            this.app.use("/auth", authrouter.getRouter()); //jangan lupa tanda kurung buat jalanin methodnya
            this.app.use("/account", accountRouter.getRouter());
            this.app.use("/event", eventRouter.getRouter());
            this.app.use("/transaction", transaction.getRouter());
            this.app.use("/review", review.getRouter());
            this.app.use("/voucher", voucher.getRouter());
            this.app.use("/ticket", ticket.getRouter());
            this.app.use("/reporting-event", reportingRouter.getRouter());
            this.app.use((req, res, next) => {
                next(new AppError_1.default(errorMessage_enum_1.ErrorMsg.ROUTE_NOT_FOUND, statusCode_enum_1.StatusCode.BAD_REQUEST));
            });
        };
        this.errorHandler = () => {
            this.app.use((error, req, res, next) => {
                if (error instanceof AppError_1.default) {
                    return res.status(error.rc).json({
                        result: {
                            success: error.success,
                            message: error.message,
                        },
                    });
                }
                //error handle unutk prisam uniqie
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    if (error.code === "P2002") {
                        const target = error.meta?.target;
                        const field = target[0];
                        return res.status(409).json({
                            result: {
                                success: false,
                                message: `${field} already used`,
                            },
                        });
                    }
                }
                //error handle unutk TokenExiperd
                if (error instanceof jsonwebtoken_1.TokenExpiredError) {
                    return res.status(statusCode_enum_1.StatusCode.UNAUTHORIZED).json({
                        result: {
                            success: false,
                            message: errorMessage_enum_1.ErrorMsg.TOKEN_EXPIRED,
                        },
                    });
                }
                // error unutk cloudinary upload
                if (error instanceof Error &&
                    error.name === "Error" &&
                    error.message?.toLowerCase().includes("cloudinary")) {
                    return res.status(500).json({
                        result: {
                            success: false,
                            message: "Cloudinary upload failed. Please try again later.",
                        },
                    });
                }
                const message = error instanceof Error ? error.message : errorMessage_enum_1.ErrorMsg.UNKNOWN_ERROR;
                return res.status(statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR).json({
                    result: {
                        success: false,
                        message,
                    },
                });
            });
        };
        this.start = () => {
            // Only start server in development
            if (process.env.NODE_ENV !== 'production') {
                this.app.listen(PORT, () => {
                    console.log(`Server is running on http://localhost:${PORT}`);
                });
            }
        };
        this.app = (0, express_1.default)();
        this.configure();
        this.route();
        this.errorHandler();
    }
}
exports.default = App;
