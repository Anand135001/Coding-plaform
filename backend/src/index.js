require('dotenv').config();

const express = require('express');
const app = express();
const mainDatabase = require('./config/db');
const cookieParser = require('cookie-parser');
const redisClient = require('./config/redis');
const authRouter = require('./routes/userAuthRoute');
const problemRouter = require('./routes/problemCreatorRoute');
const submitRouter = require('./routes/submitRoute');
const aiRouter = require('./routes/aiModel');
const videoRouter = require('./routes/videoCreate');

const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
   origin: process.env.CLIENT_URL,
   credentials: true
}))

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);
app.use('/ai', aiRouter);
app.use('/video', videoRouter)

const PORT = process.env.PORT || 3000;

const IntializeConnection = async () => {
   try{
        await Promise.all([mainDatabase(), redisClient.connect()]);
        console.log("redis and mongo connection is succesful");

        app.listen(PORT, () => {
         console.log("Running at port number:"+ PORT);
        })
   }
   catch(err){
      console.log('Error: '+err);
   }
} 

IntializeConnection();
