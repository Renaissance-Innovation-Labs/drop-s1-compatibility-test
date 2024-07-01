import cors from 'cors';
import "express-async-errors"
import express, { Application, Request } from "express";
import { PORT } from './config';
import IRoute from './interfaces/route.interface';
import morganMiddleware from './middlewares/morgan.middleware';
import { logger } from './utils/logger';
import ErrorMiddleWare from './middlewares/error.middleware';
import expressListRoutes from "express-list-routes"
import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { connectDB } from './config/db';
import createSocket from './socket';

export default class App {

    public app: Application;
    public port: string | number;
    private server: Server<typeof IncomingMessage, typeof ServerResponse>;


    constructor(routes: IRoute[]) {
        this.DBconnection()
        this.app = express();
        this.port = PORT || 8000;
        this.server = createServer(this.app)
        this.initializeMiddlewares()
        this.initializeRoutes(routes)
        this.initializeErrorHandling()
        this.listRoutes()
        createSocket(this.server)
    }

    public listen(): void {
        this.server.listen(this.port, () => {
            logger.info(`📡 [server]: Server is running @ http://localhost:${this.port}`)
        })
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(cors<Request>());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(morganMiddleware)
    }

    private initializeRoutes(routes: IRoute[]): void {
        routes.forEach(route => {
            this.app.use("/api/v1", route.router)
        })
    }

    private initializeErrorHandling() {
        this.app.use(ErrorMiddleWare.handleErrors)
    }

    private listRoutes() {
        expressListRoutes(
            this.app,
            {
                logger: ((method, space, path) => logger.info(`🚏 [Routes]: ${method}  ${path}`))
            }
        )
    }
    private async DBconnection() {
        await connectDB()
    }

}