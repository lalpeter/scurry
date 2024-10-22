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

// VARIABLES START
var stair_hole_fixed = false;
var inventory = [];
// VARIABLES END

// 1 - fwd
// 2 - left
// 3 - right
// 4 - bck
// 5 - up
// 6 - dwn

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
  var lwr = input;
  if (input){
    lwr = input.toLowerCase();
  }
  if (at == "menu"){
    at = "m1";
    prompt(`At the end of the street lies a mysterious house that, to your knowledge, hasn’t been visited for years, though an old wives’ tale tells of birds of all kinds coming in to feast each Halloween. Barring the fact that there are some geese around the house, it’s more of a silly story than a truth.

Type anything to continue.`);
  }
  else if (at == "m1"){
    at = "m2";
    prompt(`Yet one day, you, a professional chef, receive a neatly written (and confidential) letter requesting a certain dish at a certain Halloween reception: Coq au Vin. The destination? That house. 

Type anything to continue.`);
  }
  else if (at == "m2"){
    at = "m3";
    prompt(`<i>Don’t want to be bird-en. Ingredients and tools provided cheep</i>, the letter says. So you bring nothing but an <b>apron</b>. As your car arrives at the pale brown house at the end of the road, you begin to wonder if this is all a prank. Oh well.

Type anything to continue.`);
  }
  else if (at == "m3"){
    at = "m4";
    prompt(`To navigate, type single-word commands, no need to describe the subject. For example, “grab pen” should just be “grab” or “use pen” should just state the object’s name; “pen.” Type help at any time for a list of commands.
      
Type anything to continue.`);
    prompt(`<b>Commands</b> : north/fwd, south/back, east/right, west/left, up, down, look`);
  }
  else if (at == "m4"){
    at = "Front Door";
    prompt(`You are standing in front of the old hickory door of a run-down brick house. Around you is a forest of orange and red, and behind you is the one-way road that led you here. The door is unlocked.`);
    prompt(`<b>Possible exits</b> : north`);
  }
  else if (at == "Front Door"){
    if (!input){return;}
    if (lwr == "look"){
      prompt(`You are standing in front of the old hickory door of a run-down brick house. Around you is a forest of orange and red, and behind you is the one-way road that led you here. The door is unlocked.`);
      prompt(`<b>Possible exits</b> : north`);
    }
    dr = dir(input);
    console.log(dr);
    if(!dr){return;}
    if (dr == 4){
      prompt(`Though the road back seems quite inviting, you are here to complete a job. Why would you turn back?`);
    }
    if (dr == 1){
      at ="Entrance";
      prompt(`On a vintage embroidered carpet, you stand in the house’s guestroom. Some rickety stairs lead up, with a hole too big to jump across. To your left is a nice aroma, and to your right is a large living room.`);
      prompt(`<b>Possible exits</b> : west, east`);
    }
  }
  else if (at == "Entrance"){
    if (!input){return;}
    if (lwr == "look"){
      if (!stair_hole_fixed){
        prompt(`On a vintage embroidered carpet, you stand in the house’s guestroom. Some rickety stairs lead up, with a hole too big to jump across. To your left is a nice aroma, and to your right is a large living room.`);
        prompt(`<b>Possible exits</b> : west, east`);
      }
      else{
        prompt(`On a vintage embroidered carpet, you stand in the house’s guestroom. Some rickety stairs, patched by an unsturdy wooden plank, lead up. In front of you is a nice aroma, and to your right is a large living room.`);
        prompt(`<b>Possible exits</b> : up, west, east`);
      }
    }
    if(input=="plank" && inventory.includes("Plank")){
      prompt(`You place the plank on the stairs. It trembles a bit, but should work as a temporary staircase.`);
      remove("Plank");
      stair_hole_fixed = true;
    }
    dr = dir(input);
    if(!dr){return;}
    if (dr == 4){
      prompt(`The door is locked. Well, you locked it when you came in and it’s now stuck shut. Now look what you’ve done.`);
    }
    if (dr == 1){at ="Entrance";}
  }
  return null;
}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    run(input.value);
  }
});