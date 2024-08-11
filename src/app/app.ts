import express, { Application, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'http';
import RootRouter from './router';
import { origin } from '../utils/miscellaneous/constants';
import CustomError from '../utils/lib/customError';
import { SocketServer, io } from './socket';
import ErrorHandler from '../middleware/errorHandler/errorHandler';
import cron from 'node-cron';
import commonService from '../features/common/commonService/commonService';
class App {
  public app: Application = express();
  private server: Server;
  private port: number;
  private origin: string[] = origin;

  constructor(port: number) {
    this.server = SocketServer(this.app);
    this.port = port;
    this.initMiddleware();
    this.initRouters();
    this.socket();
    this.runCron();
    this.notFoundRouter();
    this.errorHandle();
  }

  // Run cron jobs
  private async runCron() {
    const services = new commonService();
    cron.schedule('0 0 */3 * *', async () => {
      await services.getSabreToken();
    });
  }

  //start server
  public startServer() {
    this.server.listen(this.port, () => {
      console.log(
        `Travel trip bd server has started successfully at port: ${this.port}...🚀`
      );
    });
  }

  //init middleware
  private initMiddleware() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(morgan('dev'));
    this.app.use(cors({ origin: this.origin, credentials: true }));
  }

  // socket connection
  private socket() {
    io.use((socket, next) => {
      if (!socket.handshake.auth?.id) {
        next(new Error('Provide id into auth.'));
      } else {
        next();
      }
    });

    io.on('connection', async (socket) => {
      const { id } = socket.handshake.auth;
      console.log(socket.id, '-', id, 'is connected ⚡');
    });
  }

  // init routers
  private initRouters() {
    this.app.get('/', (_req: Request, res: Response) => {
      res.send(`Travel trip bd server is running successfully...🚀`);
    });
    this.app.use('/api/v1', new RootRouter().v1Router);
  }

  // not found router
  private notFoundRouter() {
    this.app.use('*', (_req: Request, _res: Response, next: NextFunction) => {
      next(new CustomError('Cannot found the route', 404));
    });
  }

  // error handler
  private errorHandle() {
    this.app.use(new ErrorHandler().handleErrors);
  }
}

export default App;
