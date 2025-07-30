import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import AuthRouter from "./routers/auth.router";
import AppError from "./errors/AppError";
import { StatusCode } from "./constants/statusCode.enum";
import { ErrorMsg } from "./constants/errorMessage.enum";
import { Prisma } from "../prisma/generated/client";

const PORT: string = process.env.PORT || "8181";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.route();
    this.errorHandler();
  }

  private configure = (): void => {
    this.app.use(cors());
    this.app.use(express.json());
  };

  private route = (): void => {
    const authrouter: AuthRouter = new AuthRouter();
    this.app.get("/", (req: Request, res: Response, next: NextFunction) => {
      res.status(200).send("<h1>Test Tiket Backend</h1>");
    });

    this.app.use("/auth", authrouter.getRouter());

    //erorr buat jika route tidak ketemu
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      next(new AppError(ErrorMsg.ROUTE_NOT_FOUND, StatusCode.BAD_REQUEST));
    });
  };

  private errorHandler = (): void => {
    this.app.use(
      (error: unknown, req: Request, res: Response, next: NextFunction) => {
        // error dari AppError
        if (error instanceof AppError) {
          return res.status(error.rc).json({
            result: {
              success: error.success,
              message: error.message,
            },
          });
        }

        // Prisma error handling
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
          if (error.code === "P2002") {
            const target = error.meta?.target as string[];
            const field = target[0];
            return res.status(409).json({
              result: {
                success: false,
                message: `${field} already used`,
              },
            });
          }
        }

        // unknown error
        const message =
          error instanceof Error ? error.message : ErrorMsg.UNKNOWN_ERROR;
        return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
          result: {
            success: false,
            message,
          },
        });
      }
    );
  };

  public start = (): void => {
    this.app.listen(PORT, () => {
      console.log(`API RUNNING: http://localhost:${PORT}`);
    });
  };
}

export default App;
