# Event Gateway workflow

## Goals

* Getting familiar with the way the Event Gateway works
* Registering functions
* Creating `http` subscriptions
* Creating custom event subscriptions

## Instructions

### [Optional] Export your AWS keys

This step is optional.

You can update the `credentials-helper` file (in the `utils` directory) with your AWS credentials and run `. ../utils/credentials-helper` to set the corresponding environment variables. Otherwise you could also `export` them manually or use your default AWS profile

See [our guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/) on AWS credential handling for more information.

### Deploy the `serverless-service`

`cd` into the `serverless-service` directory and deploy the Serverless service to AWS by running `serverless deploy`.

### Invoke the `hello` function

Run `serverless invoke --function hello` to invoke the `hello` function on AWS.

### Getting the function `arn`

Run `serverless info --verbose` to see the services information.

Copy the shown function arn without the versioning part at the end (e.g. `arn:aws:lambda:us-east-1:XXXXX:function:serverless-service-dev-hello`).

### Starting the Event Gateway

Start the Event Gateway with debugging logs in development mode via `../bin/event-gateway -dev -log-level debug`.

### Registering the `hello` function at the Event Gateway

Open up a new terminal and register the `hello` function with the following `curl` call:

```sh
curl --request POST \
  --url http://localhost:4001/v1/functions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "hello",
    "provider":{
      "type": "awslambda",
      "arn": "arn:aws:lambda:us-east-1:XXXXX:function:serverless-service-dev-hello",
      "region": "us-east-1"
    }
}'
```

### Listing function registrations

Run `curl http://localhost:4001/v1/functions` to see all the registered functions. You should see the function you've just registered.

### Create a `http` subscription

Create a new `http` subscription to expose the function via a HTTP endpoint:

```sh
curl --request POST \
  --url http://localhost:4001/v1/subscriptions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "hello",
    "event": "http",
    "path": "/greeter",
    "method": "GET"
  }'
```

### Listing subscriptions

Run `curl http://localhost:4001/v1/subscriptions` to see all subscriptions. You should the recently created subscription.

### Calling the `hello` function via `http`

Run the following `curl` command to call the function via the Event Gateway (the Event Gateway acts as an API Gateway in that case).

**Note:** We're using the Event Gateways "Event API" on port `4000` in that case!

```sh
curl http://localhost:4000/greeter
```

### Create a custom event subscription

Create a new custom event subscription so that the Event Gateway calls the function whenever the defined freeform `event` is emitted.

```sh
curl --request POST \
  --url http://localhost:4001/v1/subscriptions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "hello",
    "event": "greet.me",
    "path": "/custom-event"
  }'
```

### Listing subscriptions

Run `curl http://localhost:4001/v1/subscriptions` to see all subscriptions. You should see the recently created subscription.

### Calling the `hello` function via our custom event

Run the following `curl` command to emit a `greet.me` event to the Event Gateway.

**Note:** We're using the Event Gateways "Event API" on port `4000` in that case!

```sh
curl --request POST \
  --url http://localhost:4000 \
  --header 'content-type: application/json' \
  --header 'event: greet.me' \
  --data '{ "firstName": "John", "lastName": "Doe" }'
```

Switch back to the terminal where the Event Gateway is running. You should now see that the Event Gateway received the event, invoked the function remotely and streamed back the result of the function invocation to the terminal.

### Cleanup

Stop the Event Gateway by running `ctrl + c`.
Remove the Event Gateway config via `rm -rf ../default.etcd`

Remove the `serverless-sevice` by running `serverless remove` in the `serverless-service` directory.

## Questions / Tasks

1. What's the main difference between a function call done via `http` and a custom `event`?
1. Other departments are registering several functions and subscriptions on a daily basis. You want to create a simple function discovery platform so that everyone can see what the Event Gateway currently exposes. How could you do that?
