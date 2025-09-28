const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { createAndSaveUsername, retrieveUsername, createaAndSaveExercise, findExercises, retrieveAllUsers } = require('./database/mongoDB');
const { findObjectsWithinRange, onlyEndDate, onlyStartDate } = require('./utils/dateRange');
const { isValidDate } = require('./utils/validateDate');

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

// Serve static files
app.use(express.static('public'))

// Routes
app.use('/', require('./routes/static'));
app.use('/api/users', require('./routes/users'));
app.use('/api/users/', require('./routes/exercises'));


// First API endpoint

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
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

  // Get the number of exercises for the user with _id
  let numberOfObjects = exercisesResult.length;
  // Get the array of exericses filtered by limit
  let limitedArray = [];

  // Get query parameters
  const { from, to, limit } = req.query;

  // Check if only end date is valid
  if(!isValidDate(from) && isValidDate(to)){
    // Filter exercises by end date
    let dateRangeResult = onlyEndDate(to, exercisesResult);

    // If the limit is a number and lower than or equal to the number of objects
    if(!isNaN(limit) && limit <= numberOfObjects){
      // Limit the size of the array
      limitedArray = exercisesResult.slice(0, limit);

      // Send response with log containing exercises filtered with the date range and the limit
      res.json({"_id": id, "username": userResult.username, "count": limitedArray.length, "log": limitedArray})
      return;
    }

    // If not, send response with log containing exercises filtered with the date range only
    res.json({"_id": id, "username": userResult.username, "count": numberOfObjects, "log": dateRangeResult})
    return;
  }


  // Check if only start date is valid
  if(isValidDate(from) && !isValidDate(to)){
    // Filter exercises by start date
    let dateRangeResult = onlyStartDate(from, exercisesResult);

    // If the limit is a number and lower than or equal to the number of objects
    if(!isNaN(limit) && limit <= numberOfObjects){
      // Limit the size of the array
      limitedArray = exercisesResult.slice(0, limit);

      // Send response with log containing exercises filtered with the date range and the limit
      res.json({"_id": id, "username": userResult.username, "count": limitedArray.length, "log": limitedArray})
      return;
    }

    // If not, send response with log containing exercises filtered with the date range only
    res.json({"_id": id, "username": userResult.username, "count": numberOfObjects, "log": dateRangeResult})
    return;
  }

  // Check if query parameters from and to are both valid
  if(isValidDate(from) && isValidDate(to)){
    // Filter exercises by start and end date
    let dateRangeResult = findObjectsWithinRange(from, to, exercisesResult);

    // If the limit is a number and lower than or equal to the number of objects
    if(!isNaN(limit) && limit <= numberOfObjects){
      // Limit the size of the array
      limitedArray = dateRangeResult.slice(0, limit);

      // Send response with log containing exercises filtered with the date range and the limit
      res.json({"_id": id, "username": userResult.username, "count": limitedArray.length, "log": limitedArray})
      return;
    }

    // If not, send response with log containing exercises filtered with the date range only
    res.json({"_id": id, "username": userResult.username, "count": numberOfObjects, "log": dateRangeResult})
    return;
  }

  // If neither from nor to is used as a query parameter
  // If the limit is a nubmer and lower than or equal to the number of objects
  if(!isNaN(limit) && limit <= numberOfObjects){
      limitedArray = exercisesResult.slice(0, limit);
      // Send response with log containing exercises filtered with only the limit
      res.json({"_id": id, "username": userResult.username, "count": limitedArray.length, "log": limitedArray})
      return;
  }

  // If there is no date range no limit filter, send full log as JSON response
  res.json({"_id": id, "username": userResult.username, "count": numberOfObjects, "log": exercisesResult})

})

