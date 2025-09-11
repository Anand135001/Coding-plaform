const express = require('express');
const app = express();
const mainDatabase = require('./config/db');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const redisClient = require('./config/redis');
const authRouter = require('./routes/userAuthRoute');
const problemRouter = require('./routes/problemCreatorRoute');


app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);


const IntializeConnection = async () => {
   try{
        await Promise.all([mainDatabase(), redisClient.connect()]);
        console.log("redis and mongo connection is succesful");

        app.listen(process.env.PORT, () => {
         console.log("Running at port number:"+ process.env.PORT);
      
        })
   }
   catch(err){
      console.log('Error: '+err);
   }
} 

IntializeConnection();
