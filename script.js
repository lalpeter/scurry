console.log("Hello world!");
var adventure;
fetch('./data.json').then(response => {
    if(!response.ok) {throw new Error('lmao');}
    return response.json();
}).then(data => {
    start(data.Adventure)
}).catch(error => console.error("asnd", error));

function start(adventure){
    const listOfRooms = adventure.match(/(\+.*?(?=\+)|\+.*?$)+?/gs);
    console.log(listOfRooms); //List of room strings.
    let data = [];
    for (const room of listOfRooms) {
        const name = room.match(/^\+(.*?)$/m)[0].substring(1).toLowerCase();
        console.log(name);
        data[name] = [];
        // while ((match = re.exec(rant))){
        //     if (match[1]){
        //         bWords.push(match[1]);
        //     }
        //     if (match[2]){
        //         aWords.push(match[2]);
        //     }
        // }

        // Sample REGEX Run

        // const rant = "Would you rather have unlimited bacon but no more video games, or games, unlimited games, but no games?";
        // const re = /\b(\w*b\w*)|(\w*a\w*)\b/g;
        // let match;
        // let aWords = [];
        // let bWords = [];
        // while ((match = re.exec(rant))){
        //     if (match[1]){
        //         bWords.push(match[1]);
        //     }
        //     if (match[2]){
        //         aWords.push(match[2]);
        //     }
        // }
        // console.log(`Words with b: ${bWords}`);
        // console.log(`Words with a: ${aWords}`);

    }
}