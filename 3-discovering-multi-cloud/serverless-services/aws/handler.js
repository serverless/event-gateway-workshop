"use strict";

module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello Event Gateway! (from AWS)",
      input: event
    })
  };

  callback(null, response);
};
