const cors = require("cors");

require("dotenv").config();

const express = require("express");

const mongo = require("./shared/mongo");

const {authCheck, logging} = require(".//shared/middleware");

const postRoutes = require("./routes/posts.routes");
const userRoutes = require("./routes/users.routes");



const app = express();

// Port is pushed to .env
// const PORT = 3001;

(async () => {
   try{
      // MongoDB Connect
      await mongo.connect();
  
      // Middleware to Parse Req-Body into JSON format
      app.use(express.json());  
   
      // Middleware to allow access to API's
      // CORS enabled specific to netlify site/origin
      app.use(cors({ origin: ["guviposts.netlify.com"]}));

      // Users Routes
      app.use("/users", userRoutes);

      // Middlewares
      app.use(authCheck); // Auth-Check Middleware
      app.use(logging);  // Logging Middleware

       // Posts Routes
       app.use("/posts",postRoutes);

      // Server Start
      app.listen(process.env.PORT, () => console.log(`Server Started At - ${process.env.PORT}`));
   } catch (err) {
      console.log("Error starting the Server", err);
   }
})();