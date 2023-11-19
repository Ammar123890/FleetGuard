//NPM Packages
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cors = require("cors");
require("dotenv").config();
const app = express();


//Project files and routes
const apiRouter = require("./Routes");
const connect = require("./Config/database");



// Initialize session middleware
app.use(
    session({ secret: process.env.SECRET, resave: true, saveUninitialized: true })
  );


//connect to database
connect();

//Utils
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

//connecting routes
app.use("/api", apiRouter);

//Connect Server
const PORT = process.env.PORT || 5000;
 app.listen(PORT, () => {
  console.log(`Your app is running on PORT ${PORT}`);
});


