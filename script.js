console.log("Hello world!");
var adventure;
fetch('./data.json').then(response => {
    if(!response.ok) {throw new Error('lmao');}
    return response.json();
}).then(data => {
    start(data)
}).catch(error => console.error("asnd", error));

function start(adventure){
    const info = "Pereruaiodn aroiapopajda ppa kropakod apkd ak pakpa kpodpka dkpsao podkpaojsd";
    const regex = /\b[Pp]\w*/g;
    const matches = info.match(regex);
    console.log(matches);

    adventure = adventure.toString();
    console.log(adventure);
    var listOfRooms = adventure.match(/(\+.*?(?=\+)|\+.*?$)+?/gs);
    console.log(listOfRooms);
}