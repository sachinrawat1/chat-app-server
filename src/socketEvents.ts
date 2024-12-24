import { Server, Socket } from "socket.io";

export const handleSocketEvents = (io: Server, socket: Socket) => {
  console.log(`users connected with id:${socket.id}`);
};
