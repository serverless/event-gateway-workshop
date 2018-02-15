# Discovering multi-cloud

## Goals

* Creating an "Event Gateway Discovery" web app
* Deploying a function to AWS
* Deploying a function to the Google Cloud
* Creating a function registration and subscription for the AWS function
* Creating a function registration and subscription for the Google Cloud Function
* Invoking the AWS function via the Event Gateway
* Invoking the Google Cloud Function via the Event Gateway

## Instructions

### Starting the Event Gateway

Open up a new terminal and start the Event Gateway with debugging logs in `dev` mode via `../bin/event-gateway -dev -log-level debug`.

### Opening up the Event Gateway Discovery web app

Open up the `index.html` file in the `web-discovery` directory in your browser.

You should see an alert that the Event Gateway is not reachable right now. (we'll fix that in a minute).

### Fetching all the registered functions

Open up the `index.js` file in the `web-discovery` directory. Look at the `getFunctions` function and implement the logic to fetch all the registered functions from the Event Gateway.

_Note:_ You could use `console.log` statements to debug your function and print your result to the browsers console.

### Fetching all the subscriptions

Open up the `index.js` file in the `web-discovery` directory. Look at the `getSubscriptions` function and implement the logic to fetch all the subscriptions from the Event Gateway.

_Note:_ You could use a `console.log` statement to debug your function and print your result to the browsers console.

### Validating the functionality

Refresh the `index.html` page in your browser. A message should be shown that no function registrations and subscriptions are available right now.

### [Optional] Export your AWS keys

This step is optional.

You can update the `credentials-helper` file (in the `utils` directory) with your AWS credentials and run `. ../utils/credentials-helper` to set the corresponding environment variables. Otherwise you could also `export` them manually or use your default AWS profile

See [our guide](https://serverless.com/framework/docs/providers/aws/guide/credentials/) on credential handling for more information.

### Deploying the AWS service

Switch to the `serverless-services/aws` directory and deploy the service by running `serverless deploy`.

### Get the function `arn`

Once deployed fetch the function `arn` by running `serverless info --verbose`. Copy the shown function arn without the versioning part at the end (e.g. `arn:aws:lambda:us-east-1:XXXXX:function:serverless-service-dev-hello`).

### Configuring and deploying the Google Cloud service

Navigate to the `serverless-services/gcloud` directory and, open up the `serverless.yml` file and update the `project` and `credentials` configs.

Run `npm install` to install all the dependencies. Deploy the service by running `serverless deploy`.

See [our credentials guide](https://serverless.com/framework/docs/providers/google/guide/credentials/) for the correct Google Cloud setup / configuration.

### Get the function `http` endpoint

Run `serverless info` in the `gcloud` service directory to see all the service information. Copy and save the Google Cloud Functions `http` endpoint.

### Registering the AWS function

Run the following `curl` command to register the AWS function at the Event Gateway:

```sh
curl --request POST \
  --url http://localhost:4001/v1/functions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "aws-hello",
    "provider":{
      "type": "awslambda",
      "arn": "arn:aws:lambda:us-east-1:XXXXX:function:aws-dev-hello",
      "region": "us-east-1"
    }
}'
```

### Creating a custom event subscription

Create a new custom event subscription so that the Event Gateway calls the AWS function.

```sh
curl --request POST \
  --url http://localhost:4001/v1/subscriptions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "aws-hello",
    "event": "aws.hello",
    "path": "/aws-custom-event"
  }'
```

### Registering the Google Cloud Function

Run the followig `curl` command to register the Google Cloud Function at the Event Gateway:

```sh
curl --request POST \
  --url http://localhost:4001/v1/functions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "gcloud-hello",
    "provider":{
      "type": "http",
      "url": "https://region-and-project.cloudfunctions.net/http"
    }
}'
```

### Creating a custom event subscription

Create a new custom event subscription so that the Event Gateway calls the Google Cloud Function.

```sh
curl --request POST \
  --url http://localhost:4001/v1/subscriptions \
  --header 'content-type: application/json' \
  --data '{
    "functionId": "gcloud-hello",
    "event": "gcloud.hello",
    "path": "/gcloud-custom-event"
  }'
```

### Validating our current setup

Lets validate that everything is wired up correctly. Go to the "Event Gateway Discovery" app we've just created above (open the `index.html` file in your browser).

You should see the registered functions and their corresponding subscriptions!

Since we're running the Event Gateway with `-log-level debug` we should also see some debugging logs in the terminal where the Event Gateway is running.

### Calling the AWS function

Let's call our AWS function by emitting the `aws.hello` event to the Event Gateway. This can easily be done via a `curl` call against the "Event API".

```sh
curl --request POST \
  --url http://localhost:4000 \
  --header 'content-type: application/json' \
  --header 'event: aws.hello' \
  --data '{ "firstName": "Amy", "lastName": "AWS" }'
```

Watch the Event Gateways debugging logs to see the functions response!

### Calling the Google Cloud Function

Calling our Google Cloud Function works the same way. We can simply emit a `gcloud.hello` event to the Event Gateways "Event API" via `curl`:

```sh
curl --request POST \
  --url http://localhost:4000 \
  --header 'content-type: application/json' \
  --header 'event: gcloud.hello' \
  --data '{ "firstName": "Gregory", "lastName": "GCloud" }'
```

Watch the Event Gateways debugging logs to see the functions response!

## Tasks

1. Create a new `goodbye` function and deploy it to AWS
1. Register the `goodbye` function as a `http` function type (does your `goodbye` function need some config changes?)
1. Create a new subscription for the `goodbye` function which subscribes to the `aws.goodbye` event
1. Invoke the `goodbye` function by emitting the `aws.goodbye` event
1. Deregister the AWS `hello` function from the Event Gateway
1. Remove the `aws.hello` subscription from the Event Gateway

## Cleanup

Stop the Event Gateway by running `ctrl + c`.
Remove the Event Gateway config via `rm -rf ../default.etcd`

Remove the `aws` service by running `serverless remove` in the `serverless-servics/aws` directory.
Remove the `gcloud` service by running `serverless remove` in the `serverless-services/gcloud` directory.

## Questions

1. Is there any difference when registering an AWS function vs. a Google Cloud Function? What does that mean for FaaS in general?
1. Invoke the AWS function and the Google Cloud Function again and keep an eye on the response time. Can you spot any difference?
