/*
    Attempting to offload the task using Promise (PS: It won't work)
    Why it won't work:
    Often when we learn about the blocking effect from CPU-bound tasks, 
    we turn to promises to make the code non-blocking. 
    This instinct stems from the knowledge of using non-blocking promise-based I/O methods, 
    such as readFile() and writeFile(). 
    But as we have learned, the I/O operations make use of Node.js hidden threads, 
    which CPU-bound tasks do not.
*/
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking');
});

function calculateCount() {
  return new Promise((resolve, reject) => {
    let count = 0;
    for (let i = 0; i < 2_000_000_000; i++) {
      count++;
    }
    resolve(count);
  });
}

app.get('/blocking', async (req, res) => {
  const count = await calculateCount();
  res.status(200).send(`Result is ${count}`);
});

const server = app.listen(port, () => {
  console.log(`Application listening on port: ${port}`);
});
