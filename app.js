import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const route= require('./Router/route');
import morgan from "morgan";

const app = express();

//express.json() is a built in middleware function in Express . It parses incoming JSON requests and puts the parsed data in req.body.

app.use(express.json());

// express.urlencoded() is a method inbuilt in express to recognize the incoming Request Object as strings or arrays. This method is called as a middleware in your application using the code: app.use(express.urlencoded());

app.use(express.urlencoded({ extended: true }));

//morgan logger- who is requesting which route and request will log

app.use(morgan("tiny"));


// Calling use(cors()) will enable the express server to respond to preflight requests.
app.use(cors());

app.use("/api",route);
export default app;
