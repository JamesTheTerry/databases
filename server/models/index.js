var db = require('../db').databaseConnect;

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

      // var toInsert = 'INSERT INTO messages (message, username_id, room_id) VALUES ("Some Text", 1, 42)';
      
      // check room existence
      var roomID = undefined;
      var userID = undefined;
      
      var nowWriteTheMessage = function() {
        var messsageToInsert = `INSERT INTO messages (message, username_id, room_id) VALUES ("${bodyObj.text}", "${userID}", "${roomID}")`;
        console.log('MTI', messsageToInsert);
        db.query(messsageToInsert, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('The message has been added to the db');
          }
        });
      };
      
      var nowGetUserID = function() {
        module.exports.users.get(bodyObj.username, function(queryUserID) {
          if (queryUserID !== undefined) {
            userID = queryUserID;
            nowWriteTheMessage();
          } else {
            db.query('SELECT COUNT(*) FROM users', function(err, result) {
              if (err) {
                console.log(err);
              } else {
                userID = result[0]['COUNT(*)'] + 1;
                module.exports.users.post(bodyObj.username, nowWriteTheMessage);
                // callback that does the message post
              }
            });
          }
        });
      };
      
      module.exports.rooms.get(bodyObj.roomname, function(queryRoomID) {
        if (queryRoomID !== undefined) {
          roomID = queryRoomID;
          // now call the users get
          nowGetUserID();
        } else {
          db.query('SELECT COUNT(*) FROM rooms', function(err, result) {
            if (err) {
              console.log(err);
            } else {
              roomID = result[0]['COUNT(*)'] + 1;
              module.exports.rooms.post(bodyObj.roomname, nowGetUserID);
              // pass in a callback that does the users get
            }
          });
        }
      });
      
      callback();
    } // a function which can be used to insert a message into the database
  },

  users: {
    get: function(username, callback) {
      var userExistQuery = `SELECT id FROM users WHERE name = "${username}"`;
      db.query(userExistQuery, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length) {
            console.log('User Exists, id: ', result[0].id);
            callback(result[0].id);
          } else {
            console.log('New User');
            callback(undefined);            
          }
        }
      });
    },
    post: function(username, callback) {
      var userToInsert = 'INSERT INTO users (name) VALUES ("' + username + '")';
      console.log('userToInsert', userToInsert);
      db.query(userToInsert, function(err, result) {
        if (err) {
          console.log (err);
        } else {
          console.log('Data inserted into users table');
          callback();
        }
      });
    }
  },
  
  rooms: {
    get: function(roomname, callback) {
      var roomExistQuery = `SELECT id FROM rooms WHERE name = "${roomname}"`;
      db.query(roomExistQuery, function(err, result) {
        if (err) {
          console.log(err);
        } else {
          if (result.length) {
            console.log('Room Exists, id: ', result[0].id);
            callback(result[0].id);
          } else {
            console.log('New Room');
            callback(undefined);
          }
        }
      });
    },
    post: function(roomname, callback) {
      var roomToInsert = 'INSERT INTO rooms (name) VALUES ("' + roomname + '")';
      console.log('roomToInsert', roomToInsert);
      db.query(roomToInsert, function(err, result) {
        if (err) {
          console.log (err);
        } else {
          console.log('Data inserted into rooms table');
          callback();
        }
      });
    }
  }
};

