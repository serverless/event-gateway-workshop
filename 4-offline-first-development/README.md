# Offline-first development

## Goals

* Getting familiar with `serverless run`
* Working with AWS functions locally
* Working with Google Cloud Functions locally
* Emulating cross cloud function invocations
* Implementing an event-driven function call flow

## Instructions

### **Aside** `serverless run`

Using the Event Gateway as the centerpiece for multi-cloud applications enables whole new worlds to build flexible, inter-connected, provider-spanning serverless services.

Working on such projects is a little bit harder to do since instead of dealing with one cloud provider and its services one now has to manage several different cloud providers and their services.

Wouldn't it be nice if there's an offline experience which emulates parts of the providers service offerings and helps getting basic event-driven applications off the ground with low effort?

At Serverless we took care about that when working on the Event Gateway. The Serverless Framework v1 ships with a locally running Event Gateway integration out of the box, making it possible to kick-start the event-driven serverless application development in an offline-first fashion.

All you need to do is to `cd` into your service directory and run `serverless run`. The Serverless Framework will take care of the rest.

In this chapter we'll see how offline-first local development with `serverless run` works.

### Preparing the `newsletter` service

Switch into the `newsletter` directory by running `cd serverless-services/newsletter`.

Install all the dependencies with `npm install`.

### Updating `serverless.yml`

Open up the `newsletter` service directory with your favorite editor.

In `serverless.yml` you can see all the information and configuration about the service and its functions.
We can immediately see that this is an AWS powered service, meaning that it will be deployed to the AWS cloud.

You should see the `register` function. We want to trigger this function every time a `user.registered` event is sent to the Event Gateway.

Update the configuration code so that the functions has the corresponding `events` configuration.

### Updating `handler.js`

In the `handler.js` file you should see a code which checks whether the entered E-Mail address is a VIPs address. Can you update the code so that a `marketing.vip` event is emitted to the Event Gateway once a VIP E-Mail address is detected?

### Running the service offline

Once done run `serverless run` in the services directory. This will download and setup the Event Gateway, the local function emulator, register all the services functions at the Event Gateway and subscribes the events to the corresponding functions.

`serverless run` will enter a session which means that all the debug data, the Event Gateway returns is streamed back to this terminal. This will help during local development.

One of the first information we see is the debug information about the function registration and subscription creation.

### Validating our current setup

Do you remember the "Event Gateway Discovery" project which showed all the function registrations and subscriptions we've just worked on?

You can find a fully functional version of it in this projects `utils` directory. Open up the `index.html` file with your browser and you should see the function registration and event subscription we've just created.

### Preparing the `marketing` service

Switch into the `marketing` directory by running `cd serverless-services/marketing`.

Install all the dependencies with `npm install`.

### Updating `serverless.yml`

Open up the `marketing` service directory with your favorite editor.

In `serverless.yml` you can see all the information and configuration about the service and its functions.
Here we can see that this is a Google Cloud powered service, meaning that it will be deployed to the Google Cloud.

In `serverless.yml` we can see the `vipNotifier` function. This is the function which should be invoked once a `marketing.vip` event comes in via the Event Gateway. Update the functions `event` config so that it subscribes to the `marketing.vip` event.

### Running the service offline

Once done run `serverless run` in the services directory. This time the Serverless Framework detects that another instance of the Event Gateway is already running. The Serverless Framework now re-uses the existing Event Gateway instance to register the functions and create the corresponding subscriptions.

If you take a look at the other terminal window where the `serverless run` command is still running you can see that the functions were succssefully registered and all the subscriptions are set up.

### Validating our current setup

Switch back to the browser and refresh the `index.html` file. You should now see two function registrations and two subscriptions.

### Testing

It's time to test-drive our newsletter registration application. We do that by emitting a `user.registered` event to the Event Gateways "Event API".

At first let's test our current setup with a non-VIP registration.

```
curl --request POST \
  --url http://localhost:4000 \
  --header 'content-type: application/json' \
  --header 'event: user.registered' \
  --data '{ "email": "john@doe.com" }'
```

Switch back to the terminal where your current, interactive Event Gateway session is running. You should see that the Event Gateway received a new `user.registered` event and that the registration was successful.

Let's try it again with a VIP user.

```
curl --request POST \
  --url http://localhost:4000 \
  --header 'content-type: application/json' \
  --header 'event: user.registered' \
  --data '{ "email": "taylor@swift.com" }'
```

Switch back to the terminal where the Event Gateway session is running.

It should show another log entry that the Event Gateway received a `user.registered` event and that the registration was successful. However this time the Marketing department should've received a notification since the `marketing.vip` event was emitted!

### Using the `serverless emit` command

Emitting an event via `curl` is pretty straightforward thanks to the Event Gateways `http` "Event API".

On the other hand it gets quite cumbersome to write the `curl` command every time to emit an event. Especially since the `url`, the `content-type` header and the `request` type are repeated over and over again.

The Serverless Framework got you covered and comes with a built-in `emit` command which makes it possible to emit events to the "Event API" without the need to write that `curl` based boilerplate code.

Run `serverless emit --help` to see the help for the `emit` command. Can you figure out how we can emit the same events we've used above using the `serverless emit` command?

It's as simple as running `serverless emit --name user.registered --data '{ "email": "john@doe.com" }'` and `serverless emit --name user.registered --data '{ "email": "taylor@swift.com" }'`!

Check the terminal window where the Event Gateway is running to see the Event Gateways debugging log entries.

## Questions / Tasks

1. The Marketing department decided to introduce a new `marketing.celebrity` event which should trigger the `vipNotifier` function. Which parts of the codebase needs to be updated so that the `vipNotifier` function is invoked every time this event hits the Event Gateway.
2. Furthermore the Marketing department decided to deprecate the `marketing.vip` event since "VIP" is a too broad term. At the same time it don't want to loose any existing data-deliveries to `marketing.vip` for the upcoming 3 months. How could you implement such a migration strategy? How can the Event Gateway help you with that?
