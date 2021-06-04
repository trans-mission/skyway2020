const getNewData = async () => {
    console.log('getting dataz');
    const response = await fetch('api/data');
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
