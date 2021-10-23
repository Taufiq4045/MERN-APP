require("dotenv").config();

const express = require("express");

const cors = require("cors");

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
      
       // CORS enabled specific to netlify site/origin
      app.use(cors());
  
      // Middleware to Parse Req-Body into JSON format
      app.use(express.json());  
   
      // Middleware to allow access to API's
     

      // Users Routes
      app.use("/users", userRoutes);

      // Middlewares
      app.use(authCheck); // Auth-Check Middleware
      app.use(logging);  // Logging Middleware

       // Posts Routes
       app.use("/posts",postRoutes);
      
      const port= process.env.PORT || 3001;

      // Server Start
      app.listen(port, () => console.log("Server Started At -", port));
   } catch (err) {
      console.log("Error starting the Server", err);
   }
})();
