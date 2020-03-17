const getNewData = async () => {
    console.log('getting dataz');
    const response = await fetch('api/test');
    if (response.ok) {
        const json = await response.json();
        return json;
    } else {
        console.log('Error getting data. This shouldn\'t happen!')
    }
    
}

module.exports = {
    getNewData: getNewData
};

/*
    TODO
    - Add error handling
    - Provide default data when an error occurs or initialize data to a default value or something

*/