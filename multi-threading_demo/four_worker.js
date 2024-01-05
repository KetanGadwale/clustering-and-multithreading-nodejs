/*
  OMT - Off Main Thread
  Offloading CPU Bound task to a worker thread
*/
const { workerData, parentPort } = require('worker_threads');

// doing CPU intensive task in worker
let count = 0;
for (let i = 0; i < 2_000_000_000 / workerData.thread_count; i++) {
  count++;
}

// sending expensive task result back to the main thread
parentPort.postMessage(count);
