"use strict";

exports.http = (request, response) => {
  response.status(200).send("Hello Event Gateway (from the Google Cloud)!");
};

exports.event = (event, callback) => {
  callback();
};
