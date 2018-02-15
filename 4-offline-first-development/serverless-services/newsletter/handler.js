"use strict";

const EVENT_GATEWAY_URL = "http://localhost:4000"; // process.env.EVENT_GATEWAY_URL;
const EVENT_GATEWAY_CONFIG_URL = "http://localhost:4001"; // process.env.EVENT_GATEWAY_CONFIG_URL;

const fdk = require("@serverless/fdk");
const eventGateway = fdk.eventGateway({
  url: EVENT_GATEWAY_URL,
  configurationUrl: EVENT_GATEWAY_CONFIG_URL
});

const vipEmailAddresses = [
  "kim@kardashian.com",
  "justin@bieber.com",
  "taylor@swift.com"
];

function checkForVip(email) {
  if (vipEmailAddresses.indexOf(email) > -1) {
    return eventGateway.emit({
      event: "some.event",
      data: {
        email: email
      }
    });
  }
  return Promise.resolve();
}

module.exports.register = (event, context, callback) => {
  return checkForVip(event.data.email)
    .then(() => {
      return callback(null, {
        message: "Newsletter registration successfull."
      });
    })
    .catch(err => {
      return callback({ error: err }, null);
    });
};
