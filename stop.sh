#!/bin/bash

# Find the process ID of the python3 http.server running on port 8000
pid=$(ps aux | grep "python3 -m http.server 8000" | grep -v grep | awk '{print $2}')

# Kill the process if it exists
if [ -n "$pid" ]; then
    kill $pid
    echo "Process $pid has been terminated."
else
    echo "No process found running on port 8000."
fi