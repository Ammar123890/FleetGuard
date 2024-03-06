const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require('cookie-parser');
require("dotenv").config();
const app = express();
const apiRouter = require("./Routes");
const connect = require("./Config/database");
const http = require("http");
const server = http.createServer(app);
const socketIO = require("./socket");
const io = socketIO(server);

// Initialize session middleware
app.use(
    session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
);

// Connect to database
connect();

// Utils
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb", extended: true }));
app.use(cookieParser());


// Configure CORS
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'], // Replace with your frontend URL
  credentials: true, // To allow sending of cookies
};
app.use(cors(corsOptions));

// Connecting routes
app.use("/api", apiRouter);

// Connect Server
const PORT = 3000;
server.listen(PORT, () => {
 console.log(`Your app is running on PORT ${PORT}`);
});

