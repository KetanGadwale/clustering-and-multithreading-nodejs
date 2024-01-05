/*
    Application without cluster implementation
    Having blocking CPU intensive task in 'heavy' endpoint
    This application will also be used in the each forked worker process

    Result of load test: loadtest -n 1200 -c 200 -k http://localhost:3000/heavy
    Completed requests:  1200
    Total errors:        477
    Total time:          14.434 s
    Mean latency:        3536 ms
    Effective rps:       83
*/
import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

console.log(`worker pid=${process.pid}`);

//endpoint having dummy CPU-intensive task
app.get('/heavy', (req, res) => {
  let total = 0;
  for (let i = 0; i < 5_000_000; i++) {
    total++;
  }
  res.status(200).send(`The result of the CPU intensive task is ${total}\n`);
});

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
