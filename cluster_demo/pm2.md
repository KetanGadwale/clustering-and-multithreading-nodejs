Start the `pm2` cluster with the following command:
`pm2 start index.js -i 0`

The `-i` option accepts the number of worker processes you want `pm2` to create. If you pass the argument 0, `pm2` will automatically create as many worker processes as there are CPUs on your machine.

If you want to read the logs from the worker processes, you can use the following command:
`pm2 logs`

You can also check the status of the processes using the following command:
`pm2 ls`

Now that the cluster is running, enter the following command in the same terminal to test its performance:
`loadtest -n 1200 -c 200 -k http://localhost:3000/heavy`

Result of the command:

- Completed requests: 1200
- Total errors: 0
- Total time: 2.33 s
- Mean latency: 1060.6 ms
- Effective rps: 515

To improve your workflow with `pm2`, you can generate a configuration file to pass configuration settings for your application. This approach will allow you to start or restart the cluster without passing options.

1. To use the config file, delete the current cluster:
   `pm2 delete index.js`

2. Next, generate a configuration file:
   `pm2 ecosystem`

3. Rename .js to .cjs to enable support for ES modules.

4. Add following config in `apps` in `ecosystem.config.cjs`:

   ```
   name: 'cluster_app',
   instances: 0,
   exec_mode: 'cluster'
   ```

5. To start the cluster, run the following command:
   `pm2 start ecosystem.config.cjs`

6. To confirm that the cluster is operating, check the status:
   `pm2 ls`

If you want to restart the cluster, you can use the app name you defined in the `ecosystem.config.cjs` file, which in this case is `cluster_app`:
`pm2 restart cluster_app`

To continue managing your cluster, you can run the following commands:

Command Description

```
`pm2 start app_name` - Starts the cluster
`pm2 restart app_name` - Kills the cluster and starts it again
`pm2 reload app_name` - Restarts the cluster without downtime
`pm2 stop app_name` - Stops the cluster
`pm2 delete app_name` - Deletes the cluster
```

You can now scale your application using the pm2 module and the cluster module.
