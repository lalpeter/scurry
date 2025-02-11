import ollama from 'ollama'

var input2 = `Create a comma-seperated sequence of {10} rooms that would correspond to a text adventure about the following prompt: [timothee chalamet's horror mansion]. Follow this format:
Format:
room_name:(comma separated sequence of connected rooms)
Example:
Room1:(Room2,Room3),Room2:(Room1), Room3:(Room1)")`;

var prompt ="cat pizzariea gone wrong";
var rooms = 5;

var room_generator = `Return ONLY a semicolon-seperated sequence that ends with a semicolon of ${rooms} rooms that would correspond to a text adventure about the following prompt: [${prompt}]. Start at the beginning and end at the end. Do not output any other text.`;

const room_response = await ollama.chat({
  model: 'llama3',
  messages: [{ role: 'user', content: room_generator }],
})
console.log(room_response.message.content);

var descriptor_generator = `Based on the prompt [${prompt}], for the first room: [${room_response.message.content}] return ONLY a semicolon-separated dictionary of <room name : at least one room each one would likely be connected to separated by a slash, all of which MUST be separated by a semicolon;> For example, <North Entrance: Abandoned Laboratory/Locked Door; Markiplier's Office: Creepy Corridor/Old Library; Creepy Corridor: Forgotten Storage Room/Haunted Attic; Abandoned Laboratory: Locked Door/Secret Garden; Locked Door: Hidden Crypt; Old Library: Forgotten Storage Room; Secret Garden: North Entrance; Hidden Crypt: Abandoned Laboratory;> Do not output any other text.`
const descriptor_response = await ollama.chat({
  model: 'llama3',
  messages: [{ role: 'user', content: descriptor_generator }],
})
console.log(descriptor_response.message.content);