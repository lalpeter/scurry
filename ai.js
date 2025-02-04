import ollama from 'ollama'

var input = `Create a comma-seperated sequence of {10} rooms that would correspond to a text adventure about the following prompt: [timothee chalamet's horror mansion]. Follow this format:
Format:
room_name:(comma separated sequence of connected rooms)
Example:
Room1:(Room2,Room3),Room2:(Room1), Room3:(Room1)")`;

const response = await ollama.chat({
  model: 'deepseek-r1',
  messages: [{ role: 'user', content: input }],
})
console.log(response.message.content)