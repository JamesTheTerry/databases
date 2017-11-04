var db = require('../db');

module.exports = {
  messages: {
    get: function (callback) {
      // get the messages from the db
      console.log('Model.get');
      var data = 'pie'; // but data is all the messages
      callback(data);
      
    }, // a function which produces all the messages
    post: function (bodyObj, callback) {
      // we've got a user, room, and message
      // pre req for adding message to db
        // roomID
        // userID
        // if either don't exist, create then return their id
      
      // add to message table, id (autogen), message, roomID, userID
      console.log('did we get here?');
      var toInsert = 'INSERT INTO messages (message, username_id, room_id) VALUES ("Some Text", 1, 42)';
      var roomToInsert = 'INSERT INTO rooms (name) VALUES ("' + bodyObj.roomname + '")';
      console.log('roomToInsert', roomToInsert);
      db.databaseConnect.query(roomToInsert, function(err, result) {
        if (err) {
          console.log (err);
        } else {
          console.log('It best be there');
        }
      });
      
      callback();
    } // a function which can be used to insert a message into the database
  },

  users: {
    // Ditto as above.
    get: function () {},
    post: function () {}
  }
};

