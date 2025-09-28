const { User, Exercise } = require('./models');
const { isValidDate } = require('../utils/validateDate');


const createAndSaveUsername = async (user) => {
    // Create username document
    const userEntry = new User({ username: user });
    try{
        // Save username to the users cluster
        let result = await userEntry.save()

        return result;
    }catch(err){
        console.log(err);
    }
}

const retrieveUsername = async (id) =>{
    try{
        // Query the User model with the _id
        let result = await User.findOne({ _id: id });

        return result
    }catch(error){
        console.log(error.message);
    }
}

const retrieveAllUsers = async () =>{
    try{
        // Query the User model with an empty object
        let result = await User.find({});
        return result;
    }catch(error){
        console.log(error.message);
    }
}


const createaAndSaveExercise = async (id, description, duration, date) => {
    try{
        // Create exercise document
        const exerciseEntry =  new Exercise({ description: description, duration: duration, userId: id, date: date });
        // Save document to the exercises model
        let result = await exerciseEntry.save();
        return result;
    }catch(error){
        console.log(error.message);
    }
}


const findExercises = async (id, start, end, limit) =>{
    try{
        // Get MongoDB query
        let query = {
            userId: id,
        };
        
        // If both the start and end dates are valid, add them to the query
        if(isValidDate(start) && isValidDate(end)){
            query.date = { $gte: start, $lte: end };
        // If only the start date is valid, add it to the query
        }else if(isValidDate(start)){
            query.date = { $gte: start };
        // If only the end date is valid, add it to the query
        }else if(isValidDate(end)){
            query.date = { $lte: end };
        }

        // If the limit is a valid number
        if(!isNaN(limit)){
            // Query the Exercise model and limit the results
            return await Exercise.find(query).limit(limit);
        }

        // Query the Exercise model
        let result = await Exercise.find(query);
        return result;
    }catch(error){
        console.log(error);
    }
}

module.exports = { createAndSaveUsername, retrieveUsername, createaAndSaveExercise, findExercises, retrieveAllUsers }
