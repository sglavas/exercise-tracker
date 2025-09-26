const isValidDate = date =>{
    let dateObject = new Date(date);
    
    return dateObject instanceof Date && !isNaN(dateObject)
}

module.exports = { isValidDate }
