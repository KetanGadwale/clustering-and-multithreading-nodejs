## Process

When you run a program using the node command, you create a process. The operating system allocates memory for the program, locates the program executable on your computer’s disk, and loads the program into memory. It then assigns it a process ID and begins executing the program. At that point, your program has now become a process.

On a single core machine, the processes execute **concurrently**. That is, the operating system switches between the processes in regular intervals. For example, process `C` executes for a limited time, then its state is saved somewhere and the OS schedules process `B` to execute for a limited time, and so on. This happens back and forth until all the tasks have been finished. From the output, it might look like each process has run to completion, but in reality, the OS scheduler is constantly switching between them.

On a multi-core system—assuming you have four cores—the OS schedules each process to execute on each core at the same time. This is known as **parallelism**. However, if you create four more processes (bringing the total to eight), each core will execute two processes concurrently until they are finished.

Run command: `node process.js A & node process.js B & node process.js C &` to run three process in background.

To view the running node processes: `ps | grep node`

To terminate all processes: `` kill -9 `pgrep node`  ``

## Thread

Threads are like processes: they have their own instruction pointer and can execute one JavaScript task at a time. Unlike processes, threads do not have their own memory. Instead, they reside within a process’s memory. When you create a process, it can have multiple threads created with the `worker_threads` module executing JavaScript code in parallel. Furthermore, threads can communicate with one another through message passing or sharing data in the process’s memory. This makes them lightweight in comparison to processes, since spawning a thread does not ask for more memory from the operating system.

When it comes to the execution of threads, they have similar behavior to that of processes. If you have multiple threads running on a single core system, the operating system will switch between them in regular intervals, giving each thread a chance to execute directly on the single CPU. On a multi-core system, the OS schedules the threads across all cores and executes the JavaScript code at the same time. If you end up creating more threads than there are cores available, each core will execute multiple threads concurrently.

### Hidden Threads in Node.js

JavaScript is single-threaded and all the JavaScript code executes in a single thread. This includes your program source code and third-party libraries that you include in your program. When a program makes an I/O operation to read a file or a network request, this blocks the main thread.

However, Node.js implements the `libuv` library, which provides four extra threads to a Node.js process. With these threads, the I/O operations are handled separately and when they are finished, the event loop adds the callback associated with the I/O task in a microtask queue. When the call stack in the main thread is clear, the callback is pushed on the call stack and then it executes. **To make this clear, the callback associated with the given I/O task does not execute in parallel; however, the task itself of reading a file or a network request happens in parallel with the help of the threads.** Once the I/O task finishes, the callback runs in the main thread.

In addition to these four threads, the `V8 engine`, also provides two threads for handling things like automatic garbage collection. **This brings the total number of threads in a process to seven: one main thread, four Node.js threads, and two V8 threads.**

To see the threads, run the top command and pass it the process ID displayed in the output:
`top -H -p 9999` (replace process id by checking running node process with `ps | grep node`)
