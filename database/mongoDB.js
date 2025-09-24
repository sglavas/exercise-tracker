const { User, Exercise } = require('./models');


const createAndSaveUsername = async (user) => {
    // Create username document
    const userEntry = new User({ userName: user });

    try{
        // Save username to the users cluster
        let result = await userEntry.save()

        return result;
    }catch(err){
        console.log(err.message);
    }
}

const retrieveUsername = async (id) =>{
    try{
        // Query the database with the _id
        let result = await User.findOne({ _id: id });

        return result
    }catch(error){
        console.log(error.message);
    }
}


const createaAndSaveExercise = async (id, description, duration, date) => {
    try{
        // Check if user already has an exercise schedule
        let findyByUserIdResult = await Exercise.findOne({ userId: id });

        console.log(findyByUserIdResult);

        // If the user doesn't have an exercise schedule
        if(findyByUserIdResult === null){
            // Create exercise document
            const exerciseEntry =  new Exercise({ description: description, duration: duration, userId: id, date: date });
            // Save document to the exercises cluster
            let result = await exerciseEntry.save();
            console.log(result);
            return result;
        }
    }catch(error){
        console.log("The user does not have an exercise schedule")
    }


}

module.exports = { createAndSaveUsername, retrieveUsername, createaAndSaveExercise }
