var input = document.getElementById("input");
const prompts = document.getElementById('prompts');

function prompt(toSay, xfit){
  var say = input.value;
  const newPrompt = document.createElement('div');
  newPrompt.className = 'prompt';
  if (xfit || say.substring(0,1) == "/"){
    newPrompt.style.width = "fit-content";
    newPrompt.style.alignSelf = "center";
  }
  newPrompt.innerHTML = toSay;
  input.value = '';
  prompts.prepend(newPrompt);
}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    prompt("You inputted: \n<i>" + input.value + "</i>", false);
  }
});

// Sliders!
const room_ct  = document.getElementById('room_ct');
const room_range = document.getElementById('room_range')
input.addEventListener("change", (event) => {
  room_ct.value = "hi";
})