const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const {registerSchema, loginSchema} = require("../shared/schema");

const db = require("../shared/mongo");

const service = {
    async register(req, res){
        try{
        //Request body validation
        let {error, value} = await registerSchema.validate(req.body);
        if (error) return res.status(400).send({ error: "Validation failed", message: error.details[0].message});
        
         // Check Email Exists
         const user = await db.users.findOne({ email : value.email });
         if(user) return res.status(400).send({error: "User already exists"});

         // Generate Salt & Hash
         const salt = await bcrypt.genSalt(10);
         value.password = await bcrypt.hash(value.password, salt);
         // console.log(req.body.password);

         // Insert User
         await db.users.insertOne(value);

         res.send({ message: "User registered successfully"});
        }catch (err) {
            console.log("Error Registering User - ", err);
            res.sendStatus(500);
        }
    },
    async login(req, res) {
        try{

        // request body validation
        const {error, value} = await loginSchema.validate(req.body);
        if (error) return res.status(400).send({ error: "Validation failed", message: error.details[0].message});
 
         // Check Email Exists
         const user = await db.users.findOne({ email : value.email });
         if(!user) return res.status(400).send({error: "User doesn't exists"});

         // Check Password
         const isValid = await bcrypt.compare(value.password, user.password);
         if(!isValid)
         return res.status(403).send({ error: "Email or password is wrong" });

         // Generate a Token
         const authToken = jwt.sign(
             {userId: user._id, email: user.email}, 
             process.env.JWT_SECRET,
             {expiresIn: "8hr"}
             )
         
         // console.log(authToken);
         
         res.send({ authToken })

        }catch (err) {
            console.log("Error Login User - ", err);
            res.sendStatus(500);
        }
    },
};

module.exports = service;