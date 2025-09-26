const isValidDate = date =>{
    let dateObject = new Date(date);
    
    console.log("This is the date in date validation ", dateObject instanceof Date && isNaN(dateObject));
    return dateObject instanceof Date && !isNaN(dateObject)
}

module.exports = { isValidDate }
