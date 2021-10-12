'use strict'

const WPAPI = require('wpapi');

module.exports = async (event, context) => {
  //async function run() {
  try {
    let req = event.body;

    //let req = JSON.parse(event.body);
    let result = await Send(req)
    let statuscode = 200;
    if (result.status != "success") {
      statuscode = 500;
      result.message = JSON.stringify(result.message);
    }
    console.log(result);

    return context
      .status(statuscode)
      .headers({
        "Content-type": "application/json; charset=utf-8"
      })
      .succeed(result)
  } catch (err) {
    console.log(err);
    return context
      .status(500)
      .headers({
        "Content-type": "application/json; charset=utf-8"
      })
      .succeed({ status: 'atcerror', message: err.toString() })
  }
}
async function Send(req) {
  return new Promise(resolve => {
    // You must authenticate to be able to POST (create) a post
    var wp = new WPAPI(req.credential);
    wp.posts().create({
      // "title" and "content" are the only required properties
      title: req.title,
      content: req.message,
      // Post will be created as a draft by default if a specific "status"
      // is not specified
      status: 'publish'
    }).then(function (response) {
      console.log(response.id);
      resolve({ status: 'success', message: 'You successfully posted this : ' + req.message + ' to wordpress | Post Id: ' + response.id });
    }).catch(err => {
      resolve({ status: 'serror', message: JSON.stringify(err) });
    });

  });
}
//run();