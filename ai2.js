console.log("Hello World");

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("npm install @google/generative-ai");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = "Explain how AI works";

const result = await model.generateContent(prompt);
console.log(result.response.text());

// npm i nodemon
// in package.json, add into scripts
// "start":"nodemon server.mjs"