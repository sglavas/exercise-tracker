const { User, Exercise } = require('./models');


const createAndSaveUsername = async (user) => {
    // Create username document
    const userEntry = new User({ userName: user });

    try{
        // Save username to the database
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

module.exports = { createAndSaveUsername, retrieveUsername }
