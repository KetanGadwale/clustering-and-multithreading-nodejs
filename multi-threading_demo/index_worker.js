/*
    Handling the CPU Bound task using worker_thread
    Now, non-blocking request will not be blocked due to 'blocking' endpoint CPU intensive task
*/
const express = require('express');
const { Worker } = require('worker_threads');

const app = express();

const port = process.env.PORT || 3000;

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking');
});

app.get('/blocking', (req, res) => {
  const worker = new Worker('./worker.js');
  worker.on('message', (data) => {
    res.status(200).send(`Result is ${data}`);
  });
  worker.on('error', (err) => {
    res.status(404).send(`Error ocurred: ${err}`);
  });
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
