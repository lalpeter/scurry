var input = document.getElementById("input");
const prompts = document.getElementById('prompts');

var at = "menu";

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


function give(item){
  if (!has(item)){inventory.push(item);}
}

function has(item){
  return inventory.includes(item);
}

function remove(item){
  const index = array.indexOf(item);
  if (index > -1) { array.splice(index, 1); }
}

function dir(input){
  if(!input) return null;
  input = input.toLowerCase();
  if (input == "fwd" || input == "f" || input == "n" || input == "north" || input == "forward" || input == "forwards"){ return 1;}
  if (input == "left" || input == "l" || input == "west" || input == "w"){ return 2;}
  if (input == "right" || input == "r" || input == "east" || input == "e"){ return 3;}
  if (input == "bck" || input == "b" || input == "south" || input == "s" || input == "backwards" || input == "backward" || input == "back"){ return 4;}
  if (input == "up" || input == "u" || input == "upward" || input == "upwards"){ return 5;}
  if (input == "down" || input == "dwn" || input == "d" || input == "downward" || input == "downward"){ return 6;}
}

function enter(loc){
}


function run(input){
  return null;
}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    run(input.value);
  }
});
