var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      // get the messages from the db
      console.log('Model.get');
      var data = 'pie'; // but data is all the messages
      callback(data);
      
    }, // a function which produces all the messages
    post: function () {} // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

