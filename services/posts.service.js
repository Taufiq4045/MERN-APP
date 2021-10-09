const {ObjectId} = require("mongodb");

const {postSchema} = require("../shared/schema");

const db = require("../shared/mongo");

const service = {
    async findPosts(req, res){
        try{
         //  console.log("Posts get is Called!!");
         //  console.log(req.query);  // to access query Parameter http://localhost:3001/posts?sort=asc&page=23&filter=userId
        
         //db.posts.find(); find() MogoDB ; SELECT MySqL;
        // Get all posts for specific user
         const data = await db.posts.find({userId: req.user.userId}).toArray();
         //  console.log(data);
    
         // Sending data to Front End
         res.send(data);
        }catch (err) {
            console.log("Error Reading Data - ", err);
            res.sendStatus(500);
        }
    },
    async insertPost(req, res) {
        try{

            // Request body validation
            let {error, value} = await postSchema.validate(req.body);
            if (error) return res.status(400).send({ error: "Validation failed", message: error.details[0].message});
            
       // console.log("Posts post is Called!!");
        //  insertOne() MogoDB; INSERT My SqL ;
        // Insert Post along with logged-in user
        const {insertedId : _id} = await db.posts.insertOne({
            ...value,
            userId: req.user.userId
        });
        res.send({_id, ...value})
        }catch (err) {
            console.log("Error Inserting Data - ", err);
            res.sendStatus(500);
        }
    },
    async updatePost(req, res) {
        // console.log("Posts put is Called!!");
        // console.log(req.params);
        // console.log(req.body);
        try{

            // Request body validation
            let {error, value} = await postSchema.validate(req.body);
            if (error) return res.status(400).send({ error: "Validation failed", message: error.details[0].message});
            
            // Check post belongs to logged-in user
            const post = await db.posts.findOne({
                _id:ObjectId(req.params.id),
                 userId: req.user.userId
                });

                if(!post) return res.status(401).send({ error : "You don't have access to this post"});
                
            // Update Post
          const {value: updatedValue} = await db.posts
          .findOneAndUpdate({_id:ObjectId(req.params.id)},
           {$set:{...value}},
           { returnDocument : "after"}
           );
         // console.log(value);
          res.send(updatedValue)
          }catch (err) {
              console.log("Error Updating Data - ", err);
              res.sendStatus(500);
        }
    },
    async deletePosts (req, res) {
        // console.log("Posts delete is Called!!");
        // console.log(req.params);
        // remove() MogoDB; DELETE My SqL;
        try{
            // Check post belongs to logged-in user
            const post = await db.posts.findOne({
                _id:ObjectId(req.params.id),
                 userId: req.user.userId
                });

                if(!post) return res.status(401).send({ error : "You don't have access to this post"});
              
                // Deleting the post
            await db.posts
            .deleteOne({_id:ObjectId(req.params.id)});
            res.send({});
            }catch (err) {
                console.log("Error Deleting Data - ", err);
                res.sendStatus(500);
        }
    }
};

module.exports = service;