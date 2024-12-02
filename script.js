const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// const fs = require('fs');
// app.get('/readFile', (req, res) => {
//   const filePath = './firebase.js';
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send('Error reading file');
//     } else {
//       res.send(data);
//     }
//   });
// });