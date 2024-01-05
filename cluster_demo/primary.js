/*
    Spawning index.js application to number of CPUs times
    Re-spawning on one of the worker process terminates 

    Result of load test: loadtest -n 1200 -c 200 -k http://localhost:3000/heavy
    (Result is after running on full 8 cpu-cores on Macbook Air M1)
    Completed requests:  1200
    Total errors:        0
    Total time:          0.946 s
    Mean latency:        434.1 ms
    Effective rps:       1268

    (Result is after running on only 4 cpu-cores on Macbook Air M1)
    Completed requests:  1200
    Total errors:        0
    Total time:          3.467 s
    Mean latency:        1537.9 ms
    Effective rps:       346
*/
import cluster from 'cluster';
import os from 'os';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const cpuCount = os.cpus().length; // limit cpuCount to four :-> const cpuCount = Math.min(os.cpus().length, 4);

console.log(`The total number of CPUs: ${cpuCount}`);
console.log(`Primary pid=${process.pid}`);

cluster.setupPrimary({
  exec: __dirname + '/index.js',
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
  console.log(
    `Worker ${worker.process.pid} has been killed with ${signal}-${code}`
  );
  console.log('Starting another worker');
  cluster.fork();
});
