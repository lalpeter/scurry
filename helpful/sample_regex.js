// Sample REGEX Run

const rant = "Would you rather have unlimited bacon but no more video games, or games, unlimited games, but no games?";
const re = /\b(\w*b\w*)\b/g;
const re2 = /\b(\w*a\w*)\b/g;
let match;
let aWords = [];
let bWords = [];
while (match = re.exec(rant)){
    if (match[1]){bWords.push(match[1]);}
}
while (match = re2.exec(rant)){
    if (match[1]){aWords.push(match[1]);}
}
console.log(`Words with b: ${bWords}`);
console.log(`Words with a: ${aWords}`);
