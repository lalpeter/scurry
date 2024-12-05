console.log("Hello world!");
var adventure;
fetch('./data.json').then(response => {
    if(!response.ok) {throw new Error('lmao');}
    return response.json();
}).then(data => {
    start(data.Adventure)
}).catch(error => console.error("asnd", error));

function start(adventure){
    var listOfRooms = adventure.match(/(\+.*?(?=\+)|\+.*?$)+?/gs);
    console.log(listOfRooms); //List of room strings.
}