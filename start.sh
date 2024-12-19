#!/bin/bash

# Unpack the files
tar -xzvf deployment-package.tar.gz

# Install dependencies
npm install --legacy-peers-deps

# Start the application
npm start
