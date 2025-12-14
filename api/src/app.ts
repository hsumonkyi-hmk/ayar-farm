import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes";
import auth from "./routes/auth";
import users from "./routes/users";
import crop from "./routes/crop";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", routes);
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/cropsandpulses", crop)

export default app;