const express = require('express');
const router = express.Router();
const { createAndSaveUsername, retrieveAllUsers } = require('../database/mongoDB');

// Get data from POST request


router.route('/')
    .post(async (req, res) =>{
        // Get username from input
        const userNameInput = req.body.username;

        try{
            // Add username to the database
            let result = await createAndSaveUsername(userNameInput);

            // Get database username and _id
            const id = result["_id"];
            const name = result.username;

            // Send response with username and database _id
            res.json({"username": name, "_id": id});
        }catch(error){
            console.log(error.message);
        }
    })
    .get(async (req, res) =>{
        try{
            // Query the User model to get all documents
            let usersResult = await retrieveAllUsers();

            // Send JSON response with all the users
            res.json(usersResult);
         }catch(error){
            console.log(error.message);
         }
    });

module.exports = router;