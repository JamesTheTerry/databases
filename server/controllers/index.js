var models = require('../models');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'content-type': 'application/JSON'
};

var fakeData = {
  'results': [
    {
      'username': 'James',
      'text': 'First!',
      'createdAt': '2017-10-21T00:46:46:168Z',
      'roomname': 'lobby',
      'objectId': 1
    },
    {
      'username': 'Enkhtushig',
      'text': 'Second...',
      'createdAt': '2017-10-21T00:46:46:330Z',
      'roomname': 'lobby',
      'objectId': 2
    },
    {
      'username': 'Earl John',
      'text': 'Whats up',
      'createdAt': '2017-10-21T00:46:46:330Z',
      'roomname': 'lobby',
      'objectId': 3
    }]
};


module.exports = {
  messages: {
    options: function(req, res) {
      console.log('at options');
      res.writeHead(200, defaultCorsHeaders);
      res.end();
    },
    get: function (req, res) {
      res.writeHead(200, defaultCorsHeaders);
            
      models.messages.get(function(data) {
        // data is whatever we've read from the db, so all the messages
        // we might need to stringify the data
        console.log(data);

      });
      
      //res end should actually be in the callback ^
      res.end(JSON.stringify(fakeData));
    }, // a function which handles a get request for all messages
    post: function (req, res) {
      console.log('Posting Message (Controller)');
      res.writeHead(201, defaultCorsHeaders);
      var body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        var bodyObj = JSON.parse(body);
        models.messages.post(bodyObj, function() {
          res.end('{"Eat": "it node js"}');
        });
      });
    } // a function which handles posting a message to the database
  },

  users: {
    // Ditto as above
    options: function(req, res) {
      console.log('at options');
      res.writeHead(200, defaultCorsHeaders);
      res.end();
    },
    get: function (req, res) {},
    post: function (req, res) {
      console.log('post user');
    }
  }
};

