// SECTION : PARSING OF INITIAL TEXT ADVENTURE
var adventure;
var library = [];   // All of the variables.
var inventory = new Set(); // Inventory items.
fetch('./data.json').then(response => {
    if(!response.ok) {throw new Error("Failed to process data.json.");}
    return response.json();
}).then(data => {
    start(data.Adventure);
}).catch(error => console.error("File not found.", error));

function print(anything){console.log(anything);}

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
var Enum = {
    VarActs : {
        NO : 0,
        YES : 1,
        USE : 2,
        TAKEN : 3,
        GIVE : 4,
        EXIT : 5
    }
}
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

function load(adventure){
    const listOfRooms = adventure.match(/(\+.*?(?=\+)|\+.*?$)+?/gs);
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
                location : data[3].toLowerCase(),
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

        // Extract map item use information
        // 1st capture - name of item to pickup
        // 2nd capture (optional) - !, if any
        // 4th capture (optional) - <conditional information>
        // 6th capture (optional) - (variable setting)
        // 7th capture - {prompt text}
        branch.devices = [];
        matches = match(/^%(\w*)(!?)(<(.*?)>)?(\((.*?)\))?.*?{(.*?)}/gsm, room);
        for (const data of matches) {
            if(!branch.devices[data[1]]){ branch.devices[data[1]] = []; }
            var [conditionals, variables, exitDirs] = parseDirectives(data[4], data[6]);
            branch.devices[data[1]].push({
                text : data[7].toString(),
                break : data[2]!=undefined,
                conditions : conditionals,
                vars : variables,
                exits : exitDirs
            });
        }

        // Extract attempted room exit information
        // 1st capture - name of direction
        // 3rd capture - {prompt text}
        branch.exits_fail = [];
        matches = match(/^\!(((?!\s).)*)\s*{(.*?)}/gsm, room);
        for (const data of matches) {
            branch.exits_fail[data[1]] = {
                text : data[3].toString()
            };
        }
    }
    return data;
}

// SECTION : USER NAVIGATION
var input = document.getElementById("input");
const prompts = document.getElementById('prompts');

var START_CUTSCENE = undefined;
var START_ROOM = "front_door";
var room = undefined;
var map = undefined;
var vars = [];
var items = [];
var had = [];

function prompt(toSay, xfit){
  var say = input.value;
  const newPrompt = document.createElement('div');
  newPrompt.className = 'prompt';
  newPrompt.innerHTML = toSay;
  input.value = '';
  if (xfit){
    newPrompt.style.width = "fit-content";
    newPrompt.style.alignSelf = "center";
  }
  prompts.prepend(newPrompt);
}

// 😁😁😁😁😁😁😁
// ISSUE : Variables just refuse to load in for some strange reason.
// Unsure why. See Kitchen -> Pie -> Variables, and then  look at data.txt.

function interact(input){
    let rData = map[room];
    let mItems = rData.devices;
    for (var itm in mItems){
        for (var branch of mItems[itm]){
            // USES ROOM LOGIC. MAY CAUSE PROBLEM.
            let conds = branch.conditions;
            let dvars = branch.vars;
            let exits = branch.exits;
            let brk = false;
            for (let cond of conds){ // Break if conditionals passed.
                if (!cond.isItem){
                    if (cond.action == Enum.VarActs.YES && vars[cond.name] != true){ brk = true; break; }
                    else if (cond.action == Enum.VarActs.NO && vars[cond.name] ){ brk = true; break; }
                }else{
                    if (cond.action == Enum.VarActs.YES && !items[cond.name]){ brk = true; break; }
                    else if (cond.action == Enum.VarActs.NO && items[cond.name] ){ brk = true; break; }
                    else if (cond.action == Enum.VarActs.TAKEN && !had[cond.name] ){ brk = true; break; }
                }
            }
            if(brk){continue;}
            print("we did it!");
            prompt(branch.text);
            print(dvars);
            for (let dvar of dvars){ // Set variables.
                if (!dvar.isItem){
                    if (dvar.action == Enum.VarActs.YES){vars[dvar.name]=true;}
                    else if (dvar.action == Enum.VarActs.NO){vars[dvar.name]=false;}
                }else{
                    if (dvar.action == Enum.VarActs.GIVE){items[dvar.name]=true; had[dvar.name]=true;}
                    else if (dvar.action == Enum.VarActs.NO){items[dvar.name]=false;}
                    else if (dvar.action == Enum.VarActs.EXIT){rData.exits[dvar.name].disabled=false;}
                }
            }
            if(branch.break){
                delete mItems[itm];
            }
        }
    }
    if(mItems){return true;}
}

function use_item(input){
    
}

function action(input){
    let rData = map[room];
    let exitData = rData.exits[input];
    if (exitData&&!exitData.disabled){//Check if input matches an exit direction. If so, travel.
        let nextRoom = exitData.location;
        room = nextRoom;
        describe(room);
    }else if(input == "look"||input=="about"||input=="where"||input=="?"){//Room reloading.
        describe(room);
    }else if(interact(input)){//Use map items. Includes "collect" and "devices".

    }else if(use_item(input)){//Use inventory items. 

    }else{
        prompt('"' + input.toString().toLowerCase() + '" does not make sense.' );
    }
    //
}

input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        action(input.value);
    }
});

function describe(location){
    let rData = map[location];
    // Prompts!

    var toPrint = "";
    var ost = true;
    for (let pData of rData.prompts ){
        let conds = pData.conditions;
        let dvars = pData.vars;
        let exits = pData.exits;
        let brk = false;
        for (let cond of conds){ // Break if conditionals passed.
            if (!cond.isItem){
                if (cond.action == Enum.VarActs.YES && vars[cond.name] != true){ brk = true; break; }
                else if (cond.action == Enum.VarActs.NO && vars[cond.name] ){ brk = true; break; }
            }else{
                if (cond.action == Enum.VarActs.YES && !items[cond.name]){ brk = true; break; }
                else if (cond.action == Enum.VarActs.NO && items[cond.name] ){ brk = true; break; }
                else if (cond.action == Enum.VarActs.TAKEN && !had[cond.name] ){ brk = true; break; }
            }
        }
        if(brk){continue;}
        if(!ost){toPrint += "\n\n";}
        toPrint += pData.text;
        for (let dvar of dvars){ // Set variables.
            if (!dvar.isItem){
                if (dvar.action == Enum.VarActs.YES){vars[dvar.name]=true;}
                else if (dvar.action == Enum.VarActs.NO){vars[dvar.name]=false;}
            }else{
                if (dvar.action == Enum.VarActs.GIVE){items[dvar.name]=true; had[dvar.name]=true;}
                else if (dvar.action == Enum.VarActs.NO){items[dvar.name]=false;}
                else if (dvar.action == Enum.VarActs.EXIT){rData.exits[dvar.name].disabled=false;}
            }
        }
        ost = false;
    }

    prompt(toPrint);

    //Exits are acting weird.
    var exitStr = "<b>Possible exits:</b> ";
    ost = true;
    for (var direction in rData.exits ){
        var exitData = rData.exits[direction];
        if(!exitData.disabled){ 
            if(!ost){exitStr+=", "}
            exitStr += direction;
            ost = false;
        }
    }
    prompt(exitStr);
}

function start(adventure){
    map = load(adventure);
    console.log(map);
    if (START_CUTSCENE){
        console.log("cutscene!");
    }else{
        room = START_ROOM;
    }
    describe(room);
}