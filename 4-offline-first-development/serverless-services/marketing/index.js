"use strict";

exports.vipDetector = (event, callback) => {
  const email = event.data.email;

  return callback(null, {
    message: `VIP with E-Mail address "${email}" detected.`
  });
};
