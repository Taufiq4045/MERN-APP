const {MongoClient} = require("mongodb");

// LocalHost Connection pushed to .env
// const MONGODB_URL = "mongodb://localhost:27017";

// Connecting to Cloud Database
// const MONGODB_URL = "mongodb+srv://Guvi_Posts:Admin123@cluster0.slunw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// LocalHost Connection Name pushed to .env
// const MONGODB_NAME = "guvi_posts";

const client = new MongoClient(process.env.MONGODB_URL);

module.exports = {
    // Connections to all the Collections
    db: null,

    // Connection to Specific Collections
    posts: null,
    users: null,

    async connect() {
        // Conection to Database
        await client.connect();
        console.log("connected to Mongo -", process.env.MONGODB_URL);
      
        // Selection to Database
        this.db = client.db(process.env.MONGODB_NAME);
        console.log("Selected Database -", process.env.MONGODB_NAME);

        //Initialize Collections
        this.posts = this.db.collection("posts");
        console.log("Initialized Collection - Posts")
        this.users = this.db.collection("users");
        console.log("Initialized Collection - Users")

    },
};

