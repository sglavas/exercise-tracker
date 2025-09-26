const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createAndSaveUsername, retrieveUsername, createaAndSaveExercise, findExercises } = require('./database/mongoDB');
const { findObjectsWithinRange } = require('./utils/dateRange');

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
  // Get value from _id input
  const id = req.body[":_id"];
  // Get values from description, duration and date inputs
  const { description, duration, date } = req.body;

  // Check if the required input fields have values
  if(!description || !duration || !date){
    // If not, send error response
    res.json({error: "Paths 'description', 'duration', and '_id' are required."})
    return;
  }

  // Query the database with the _id
  let userResult = await retrieveUsername(id);
  // If _id doesn't exist in the database
  if(userResult === undefined){
    // Send error response
    res.json({error: "ID not found"})
    return;
  }

  // Create Date object
  const dateObject = new Date(date);
  // Check if date is valid
  if(dateObject instanceof Date && !isNaN(dateObject)){
    // Turn Date object into date string
    let dateAsString = dateObject.toDateString();
    console.log(userResult);
    // If valid, save the exercise document to the model
    res.json({"_id": id, "username": userResult.userName, "date": dateAsString, "duration": duration, "description": description });
    createaAndSaveExercise(id, description, duration, dateAsString);
  }else{
    // If not valid, send error response
    res.json({error: "Invalid date"})
  }
})


// Specify /api/users/:_id/logs route GET method
app.get('/api/users/:_id/logs', async (req,res) =>{
  // Get _id route parameter
  const id = req.params["_id"];

  // Query the Exercise model with _id
  let exercisesResult = await findExercises(id);
  // Query the User model with _id
  let userResult = await retrieveUsername(id);

  // If document with _id does not exist
  if(userResult === undefined){
    // Send error response
    res.json({"error": "Invalid user ID"});
    return;
  }

  console.log(exercisesResult);
  // Get the number of exercises for the user with _id
  let numberOfObjects = exercisesResult.length;
  // Get the array of exericses filtered by limit
  let limitedArray = [];

  // Get query parameters
  const { from, to, limit } = req.query;

  // Check if query parameters from or to are used
  if(from || to){
    let dateRangeResult = findObjectsWithinRange(from, to, exercisesResult);

    // If the limit is lower than or equal to the number of objects
    if(limit <= numberOfObjects){
      // Loop through the array
      for(let i = 0; i < limit; i++){
        // Push the exercises to the limitedArray
        limitedArray.push(dateRangeResult[i]);
      }
      console.log("This is the limitedArray " + limitedArray);
      // Send response with log containing exercises filtered with the date range and the limit
      res.json({"_id": id, "username": userResult.userName, "count": limitedArray.length, "log": limitedArray})
      return;
    }

    console.log("These are the results of dateRange.js " + dateRangeResult);
    return;
  }

  // Send response for user with _id
  res.json({"_id": id, "username": userResult.userName, "count": numberOfObjects, "log": exercisesResult})

})

