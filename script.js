var input = document.getElementById("input");
const prompts = document.getElementById('prompts');

function prompt(toSay, xfit){
  var say = input.value;
  const newPrompt = document.createElement('div');
  newPrompt.className = 'prompt';
  newPrompt.innerHTML = toSay;
  input.value = '';
  if (xfit || toSay == "You inputted: \n<i>" + "size in x direction" + "</i>"){
    newPrompt.style.width = "fit-content";
    newPrompt.style.alignSelf = "center";
  }
  prompts.prepend(newPrompt);
}

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    prompt("You inputted: \n<i>" + input.value + "</i>", false);
  }
});