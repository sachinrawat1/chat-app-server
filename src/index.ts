import express, { Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import userRoutes from "./routes/userRoutes";
import { errorHandler } from "./middleware/errorMiddleware";

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {});

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Server Running...");
});

app.use("/apis/v1/users", userRoutes);
app.use(errorHandler);

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
