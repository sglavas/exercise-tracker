const express = require('express');
const router = express.Router();
const { retrieveUsername, createaAndSaveExercise, findExercises } = require('../database/mongoDB');
const { findObjectsWithinRange, onlyEndDate, onlyStartDate } = require('../utils/dateRange');
const { isValidDate } = require('../utils/validateDate');
const populateArray = require('../utils/populateArray');

// Specify /api/users/:_id/exercises route POST method
router.post('/:_id/exercises', async (req, res) =>{
  // Get value from _id input
  const id = req.body[":_id"];
  // Get values from description, duration and date inputs
  const { description, duration, date } = req.body;

  // Check if the required input fields have values
  if(!description || !duration || !id){
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

  // Check if duration is a valid integer
  const validInteger = parseInt(duration);
  // If not valid
  if(isNaN(validInteger)){
    // Send error response
    res.json({error: "Duration is not valid"});
    return;
  }

  let dateObject;

  // If date is missing
  if(!date){
    // Use the current date
    dateObject = new Date();
  }else{
    // If it is provided, use the provided date
    dateObject = new Date(date);
  }

  // Check if date is valid
  if(dateObject instanceof Date && !isNaN(dateObject)){
    // Turn Date object into date string
    let dateAsString = dateObject.toDateString();
    // If valid, save the exercise document to the model
    res.json({"_id": id, "username": userResult.username, "date": dateAsString, "duration": validInteger, "description": description });
    createaAndSaveExercise(id, description, validInteger, date);
  }else{
    // If not valid, send error response
    res.json({error: "Invalid date"})
  }
})

// Specify /api/users/:_id/logs route GET method
router.get('/:_id/logs', async (req, res) =>{
    // Get _id route parameter
    const id = req.params["_id"];
    // Get query parameters
    const { from, to, limit } = req.query;

    const startDate = new Date (from);
    const endDate = new Date(to);

    // Query the Exercise model with _id
    let exercisesResult = await findExercises(id, startDate, endDate, limit);
    // Query the User model with _id
    let userResult = await retrieveUsername(id);
    console.log("These are the exercises " + exercisesResult)
    let populatedArray = populateArray(exercisesResult)

    res.json({ "_id": id, "username": userResult.username, "count": exercisesResult.length, "log": populatedArray })
})


module.exports = router;