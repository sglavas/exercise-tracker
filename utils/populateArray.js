const populateArray = array =>{
    let finalArray = []

    array.forEach(e =>{
        let object = {};
        object.description = e.description;
        object.duration = parseInt(e.duration);
        object.date = e.date.toDateString();
        finalArray.push(object);
    })

    return finalArray;
}

module.exports = populateArray