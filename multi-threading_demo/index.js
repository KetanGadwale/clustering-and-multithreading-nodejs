/*
    Creating CPU Bound task without worker threads
    `blocking` endpoint has CPU intensive task which will block the main thread
    `non-blocking' endpoint request will suffer from this blocking effect of the CPU Bound task
*/
const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking');
});

app.get('/blocking', (req, res) => {
  let count = 0;
  for (let i = 0; i < 2_000_000_000; i++) {
    count++;
  }
  res.status(200).send(`Result is ${count}`);
});

const server = app.listen(port, () => {
  console.log(`Application listening on port: ${port}`);
});
