const findObjectsWithinRange = (start, end, datesArray) =>{
    // Array of exercises between start date and end date
    let resultArray = [];

    // If we have both start date and end date, use them to create date objects 
    let startDate = new Date(start);
    let endDate = new Date(end);

    // Loop through datesArray
    datesArray.forEach(e =>{
        // Check if exercise are scheduled between the start and end dates inclusively
        if(startDate <= new Date(e.date) && new Date(e.date) <= endDate){
            // If so, push to the resultArray
            resultArray.push(e);
        }
    })
    return resultArray;
}

const onlyStartDate = (start, datesArray) => {
    // Array of exercises after the start date
    let resultArray = [];
    // Create the Date object
    let startDate = new Date(start);

    // Loop through datesArray
    datesArray.forEach(e =>{
        // Check if exercises are scheduled after the start date
        if(startDate <= new Date(e.date)){
            // If so, push to the resultArray
            resultArray.push(e);
        }
    })
    return resultArray;
}

const onlyEndDate = (end, datesArray) => {
    // Array of exercises before the end date
    let resultArray = [];
    // Create the Date object
    let endDate = new Date(end);
    
    // Loop through datesArrray
    datesArray.forEach(e =>{
        // Check if exercises are scheduled before the end date
        if(new Date(e.date) <= endDate){
            // If so, push to the resultArray
            resultArray.push(e);
        }
    })
    return resultArray;
}

module.exports = { findObjectsWithinRange, onlyEndDate, onlyStartDate }
