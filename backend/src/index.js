const express = require('express');
const app = express();
const main = require('./config/db');
const cookieParser = require('cookie-parser');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());

main()
.then(async ()=>{
   app.listen(process.env.PORT, () => {
      console.log("Running at port number:"+ process.env.PORT);
      
   })
})
.catch(err => console.log("Error Occurred:", +err));