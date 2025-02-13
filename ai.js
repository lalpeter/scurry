import ollama from 'ollama'

var input2 = `Create a comma-seperated sequence of {10} rooms that would correspond to a text adventure about the following prompt: [timothee chalamet's horror mansion]. Follow this format:
Format:
room_name:(comma separated sequence of connected rooms)
Example:
Room1:(Room2,Room3),Room2:(Room1), Room3:(Room1)")`;

var prompt ="cat pizzeria gone wrong, comedy";
var rooms = 10;

var room_generator = `Return ONLY a semicolon-seperated sequence of ${rooms} rooms that would correspond to a text adventure about the following prompt: [${prompt}]. Start at the beginning and end at the end. Do not output any other text.`;

var room_response = await ollama.chat({
  model: 'llama3',
  messages: [{ role: 'user', content: room_generator }],
});

room_response = room_response.message.content;
if (room_response.substring(room_response.length-1, room_response.length) == ";"){
  room_response = room_response.substring(0,room_response.length-1);
}

var intro_generator = `Based on the prompt [${prompt}], return ONLY a 3-5 paragraph text description of an intro to a text adventure, describing things that would be included such as what the place is, how you got there, what you want to do, etc. Describe simply but use vivid imagery. Do not describe any interactable items, people, or exits. Do not output any other text.`;
const intro_response = await ollama.chat({
  model: 'llama3',
  messages: [{ role: 'user', content: intro_generator }],
})
console.log(intro_response.message.content);

console.log(room_response)
var room_arr = room_response.split(/; */g)
console.log(room_arr)
for(const room_name of room_arr){
  console.log(room_name)
  var descriptor_generator = `Based on the prompt [${prompt}], for the following room: [${room_name}] return ONLY a text description of the room in the style of a text adventure. Describe simply but use vivid imagery. Do not describe any interactable items, people, or exits. Do not output any other text.`;
  const descriptor_response = await ollama.chat({
    model: 'llama3',
    messages: [{ role: 'user', content: descriptor_generator }],
  })
  console.log(descriptor_response.message.content);

  var other_rooms = room_arr.slice();
  other_rooms.splice(room_arr.indexOf(room_name), 1);

  var nbr_generator = `Based on the prompt [${prompt}], for the following room: [${room_name}] return ONLY a sequence of 2-4 other rooms from the possible rooms list: [${other_rooms}] that would most likely be connected to this one delimited by semicolons. Do not output any other text.`;
  const nbr_response = await ollama.chat({
    model: 'llama3',
    messages: [{ role: 'user', content: nbr_generator }],
  })
  console.log(nbr_response.message.content);

  var height_generator = `Based on the text adventure prompt [${prompt}], for the following room: [${room_name}] return a 0 if it makes sense for this room to be at ground level, a 1 if it makes sense for this room to be underground, and a 2 if it makes sense for this room to be suspended above other rooms. Do not output any other text.`;
  const height_response = await ollama.chat({
    model: 'llama3',
    messages: [{ role: 'user', content: height_generator }],
  })
  console.log(height_response.message.content);

  console.log();
}

// var descriptor_generator = `Based on the prompt [${prompt}], for the following rooms: [${room_response}] return ONLY a semicolon-separated dictionary of <room name : at least one room each one would likely be connected to separated by a slash, all of which MUST be separated by a semicolon;> For example, <North Entrance: Abandoned Laboratory/Locked Door; Markiplier's Office: Creepy Corridor/Old Library; Creepy Corridor: Forgotten Storage Room/Haunted Attic; Abandoned Laboratory: Locked Door/Secret Garden; Locked Door: Hidden Crypt; Old Library: Forgotten Storage Room; Secret Garden: North Entrance; Hidden Crypt: Abandoned Laboratory;> Do not output any other text.`;
// const descriptor_response = await ollama.chat({
//   model: 'llama3',
//   messages: [{ role: 'user', content: descriptor_generator }],
// })
// console.log(descriptor_response.message.content);