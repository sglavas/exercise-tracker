const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createAndSaveUsername, retrieveUsername } = require('./database/mongoDB');

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


// Get data from POST request

// Specify /api/users route POST method
app.post('/api/users', async (req, res) =>{
  // Get username from input
  const { username } = req.body;

  try{
    // Add username to the database
    let result = await createAndSaveUsername(username);

    // Get database username and _id
    const id = result["_id"];
    const name = result.userName;

    // Send response with username and database _id
    res.json({"username": name, "_id": id});
  }catch(error){
    console.log(error.message);
  }

})

// Specify /api/users/:_id/exercises route POST method
app.post('/api/users/:_id/exercises', async (req, res) =>{
  const id = req.body[":_id"];
  const { description, duration, date } = req.body;

  // Query the database with the _id
  let userResult = await retrieveUsername(id);
  if(userResult === undefined){
    res.json({error: "ID not found"})
    return;
  }
  console.log(userResult);
})

