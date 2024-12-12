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
var USE = 2;    // ! : var, consume
var TAKEN = 3;  // - : var, taken
var GIVE = 4;   // ^ : var, give
var EXIT = 5;   // @ : var, exit
var VAR_ENUMS = {"!" : NO, "=" : YES, "![" : USE, "-" : TAKEN, "^" : GIVE, "@" : EXIT}

function parseDirectives(conditionals, variables){
    // about dirs:
    //      0 : conditional statements         < ... >
    //      1 : variable statements            ( ... )
    //      2 : exits to enable                ( @[] )

    //  format of [0] and [1]:
    //      { name : string, action : enum, isItem : boolean }
    //      ![saucey] -> { name : saucey, action : USE, item : true }
    //  format of [2]: list of strings relating to the direction.

    var dirs = [ [], [], [] ]; //You can index any index! Even  if prev. ones are empty.
    if(conditionals){
        for (const cond of match(/([=!\-^@])(\[?)([^=!\-^@\]]*)/g, conditionals)) {
            var setName = cond[3]; var sym = cond[1]; var setIsItem = cond[2]!=0;
            //console.log(`name <${name}> with symbol <${sym}>. is${isItem? "" : " not"} a variable.`);
            var setAction = VAR_ENUMS[sym];
            if (setIsItem && sym == "!"){ setAction = USE; }
            dirs[0].push( {name : setName, action : setAction, isItem : setIsItem } );
        }
    }
    if(variables){
        for (const cond of match(/([=!\-^@])(\[?)([^=!\-^@\]]*)/g, conditionals)) {
            var setName = cond[3]; var sym = cond[1]; var setIsItem = cond[2]!=0;
            var setAction = VAR_ENUMS[sym];
            if (setIsItem && sym == "!"){ setAction = USE; }
            if (sym != "@"){
                dirs[1].push( {name : setName, action : setAction, isItem : setIsItem } );
            }else{
                dirs[2].push( setName );
            }
        }
    }
    return dirs;
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
            var [conditionals, variables, exitDirs] = parseDirectives(data[2], data[4]);
            branch.prompts.push({
                text : data[5],
                conditions : conditionals,
                vars : variables,
                exits : exitDirs
            })
        }

        // Extracts pickup information
        // 1st capture - name of item to pickup
        // 2nd capture (optional) - !, if any
        // 4th capture (optional) - <conditional information>
        // 6th capture (optional) - (variable setting)
        // 7th capture - {prompt text}
        branch.collect = [];
        matches = match(/^\^(\w*)(\!)?(<(.*?)>)?(\((.*?)\))?.*?{(.*?)}/gms, room);
        for (const data of matches) {
            if(!branch.collect[data[1]]){ branch.collect[data[1]] = []; }
            var [conditionals, variables, exitDirs] = parseDirectives(data[4], data[6]);
            branch.collect[data[1]].push({
                text : data[7],
                deny : data[2]!=undefined,
                conditions : conditionals,
                vars : variables,
                exits : exitDirs
            });
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