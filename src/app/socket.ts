import { Application } from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { origin } from '../utils/miscellaneous/constants';
export let io: Server;

export const SocketServer = (app: Application) => {
  const server = http.createServer(app);
  io = new Server(server, {
    cors: { origin: origin },
  });

  return server;
};
