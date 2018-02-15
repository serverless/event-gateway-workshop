# Exploring the Event Gateway

## Goals

* Install and setup the Event Gateway
* Learn about the different concepts such as function registration, subscriptions and events
* Run the Event Gateway locally
* Explore its capabilities

## Instructions

### Download the Event Gateway

Download the Event Gateway on your local development machine using the download script.

`cd` into the root of the project and run `./utils/eg-download`.

### Verify the installation

Verify that the Event Gateway is downloaded and successfully installed by running `./bin/event-gateway -version`.

You should see the Event Gateways version number popping up in your terminal.

### Exploring the concepts

Run `./bin/event-gateway -help` to see what options you have when running the Event Gateway.

Can you figure out to run the Event Gateway locally?

Skim through the Event Gateways [`README`](https://github.com/serverless/event-gateway/blob/master/README.md) to read about its inner-workings, the concepts and its capabilities.

### Starting locally in `dev` mode

Open up a new terminal and run `./bin/event-gateway -dev` to start the Event Gateway locally in development mode.

### Listing registered functions

Run `curl http://localhost:4001/v1/functions` to see all the registered functions. You should see an empty array since we haven't registered any functions yet.

### Listing subscriptions

Run `curl http://localhost:4001/v1/subscriptions` to see all subscriptions. You should see an empty array since we haven't created any subscriptions yet.

### Stopping the Event Gateway

Run `ctrl + c` to stop the Event Gateway.

## Questions

1. How would you run the Event Gateway locally with enabled debugging logs?
1. What's the difference between the "Configuration API" and the "Events API"?
1. What is the `FDK`?
1. What steps do I need to take to make a remote function callable via the Event Gateway?
1. What role does `etcd` play?
