/*
    Optimizing a CPU-Intensive task using four worker_threads
*/
const express = require('express');
const { Worker } = require('worker_threads');

const app = express();

const port = process.env.PORT || 3000;
const THREAD_COUNT = 4;

app.get('/non-blocking', (req, res) => {
  res.status(200).send('This page is non-blocking');
});

function createWorker() {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./four_worker.js', {
      workerData: { thread_count: THREAD_COUNT },
    });

    worker.on('message', (data) => {
      resolve(data);
    });
    worker.on('error', (err) => {
      reject(err);
    });
  });
}

app.get('/blocking', async (req, res) => {
  const workerPromises = [];
  for (let i = 0; i < THREAD_COUNT; i++) {
    workerPromises.push(createWorker());
  }
  const threadResult = await Promise.all(workerPromises);
  const total = threadResult.reduce((acc, item) => (acc += item), 0);
  res.status(200).send(`Result is ${total} ${threadResult}`);
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
