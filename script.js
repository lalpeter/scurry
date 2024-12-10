var adventure;
fetch('./data.json').then(response => {
    if(!response.ok) {throw new Error("Failed to process data.json.");}
    return response.json();
}).then(data => {
    start(data.Adventure)
}).catch(error => console.error("File not found.", error));

// Returns an array of string matches!
function match(pattern, data){
    var match;
    var info = [];
    while (match = pattern.exec(data)){
        info.push(match);
    }
    return info;
}

//Variable classification enums
var NO = 0;     // ! : false
var YES = 1;    // = : true
var TAKEN = 2;  // - : taken
var GIVE = 3;   // ^ : give

function parseDirectives(conditionals, variables){
    console.log(conditionals, variables);
    var dirs = []; //You can index any index! Even  if prev. ones are empty.
    if(conditionals){

    }
    if(variables){

    }
}

function start(adventure){
    const listOfRooms = adventure.match(/(\+.*?(?=\+)|\+.*?$)+?/gs);
    console.log(listOfRooms); //List of room strings.
    let data = [];
    for (const room of listOfRooms) {
        const name = room.match(/^\+(.*?)$/m)[0].substring(1).toLowerCase();
        data[name] = [];
        var branch = data[name];
        
        // Extract exits
        // 1st capture - name of direction
        // 2nd capture - tilde, if any
        // 3nd capture - exit room name
        branch.exits = [];
        let matches = match(/^@(.*?)(~)?=(.*)$/gm, room);
        for (const data of matches) {
            branch.exits[data[1]] = {
                exit_direction : data[3].toLowerCase(),
                disabled : data[2] != undefined
            }
        }

        // Extracts prompts
        // 2nd capture (optional) - <conditional information>
        // 4th capture (optional) - (variable setting)
        // 5th capture - {prompt text}

        branch.prompts = [];
        matches = match(/\?(<(.*?)>)?(\((.*?)\))?[^}]*?{(.*?)}/gs, room);
        for (const data of matches) {
            let [item_conditions, vitem_actions, ar_conditions, var_actions, exits] = parseDirectives(data[2], data[4]);
            branch.prompts.push({
                text : data[5]
            })
        }

        // Sample REGEX Run

        // const rant = "Would you rather have unlimited bacon but no more video games, or games, unlimited games, but no games?";
        // const re = /\b(\w*b\w*)\b/g;
        // const re2 = /\b(\w*a\w*)\b/g;
        // let match;
        // let aWords = [];
        // let bWords = [];
        // while (match = re.exec(rant)){
        //     if (match[1]){bWords.push(match[1]);}
        // }
        // while (match = re2.exec(rant)){
        //     if (match[1]){aWords.push(match[1]);}
        // }
        // console.log(`Words with b: ${bWords}`);
        // console.log(`Words with a: ${aWords}`);

    }
    console.log(data);
}