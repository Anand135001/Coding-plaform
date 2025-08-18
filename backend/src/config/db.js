const mongoose = require("mongoose");

async function mainDatabase() {
  await mongoose.connect(process.env.DB_CONNECT_STRING);
  
}

module.exports = mainDatabase;

