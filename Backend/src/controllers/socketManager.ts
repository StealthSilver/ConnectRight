import { Server as HTTPServer } from "http";
import { Server, ServerOptions } from "socket.io";

export const connectToSocket = (
  server: HTTPServer,
  options?: Partial<ServerOptions>
) => {
  const io = new Server(server, options); // can pass CORS/options if needed
  return io;
};
