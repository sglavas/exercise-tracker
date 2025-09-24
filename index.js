const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Basic configuration

/**
 * MongoDB connection
 * @description Connects to the database and logs success or error message
 */
const connectToDb = async () =>{
  try{
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo DB connection successful.")
  }catch(error){
    console.error("MongoDB connection error: ", error.message);
  }
}

connectToDb();

// Body Parser Setup
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



// First API endpoint

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
