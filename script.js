var input = document.getElementById("input");
const prompts = document.getElementById('prompts');

input.addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    console.log(input.value);
    var say = input.value;
    const newPrompt = document.createElement('div');
    newPrompt.className = 'prompt';
    newPrompt.innerHTML = "You inputted: \n<i>" + input.value + "</i>";
    input.value = '';
    prompts.prepend(newPrompt);
  }
});