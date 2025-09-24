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

module.exports = { createAndSaveUsername }
