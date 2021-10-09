const route = require("express").Router();

const service =  require("../services/posts.service");

//Post API Routes 

route.get("/", service.findPosts);
route.post("/", service.insertPost);
route.put("/:id", service.updatePost);
route.delete("/:id", service.deletePosts);

module.exports = route;

