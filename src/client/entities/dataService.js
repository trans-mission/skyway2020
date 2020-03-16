// const getNewData = async () => {
//     const response = await fetch('api/test');
//     const json = await response.json();
//     return json;
// }

const getNewData = () => {
    let request= new XMLHttpRequest();
    request.open('GET', 'api/test', false);
    request.send(null);

    if (request.status === 200) {
        const data = request.responseText;
        const result = JSON.parse(data);
        return result;
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