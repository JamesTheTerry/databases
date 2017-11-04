var db = require('../db').databaseConnect;

// SELECT messages.id, messages.message, users.username, rooms.roomname FROM messages, users, rooms WHERE messages.username_id = users.id AND messages.room_id = rooms.id;

module.exports = {
  messages: {
    get: function (callback) {
      var getQuery = 'SELECT messages.id, messages.message, users.username, rooms.roomname FROM messages, users, rooms WHERE messages.username_id = users.id AND messages.room_id = rooms.id';
      db.query(getQuery, function(err, result) {
        console.log(result);
        callback(result);
      });
    }, // a function which produces all the messages
    post: function (bodyObj, callback) {
      var roomID = undefined;
      var userID = undefined;
      
      var nowWriteTheMessage = function() {
        var messsageToInsert = `INSERT INTO messages (message, username_id, room_id) VALUES ("${bodyObj.message}", "${userID}", "${roomID}")`;
        console.log('MTI', messsageToInsert);
        db.query(messsageToInsert, function(err, result) {
          if (err) {
            console.log(err);
          } else {
            console.log('The message has been added to the db');
            callback();
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
      
    } // a function which can be used to insert a message into the database
  },

  users: {
    get: function(username, callback) {
      console.log('In user model');
      var userExistQuery = `SELECT id FROM users WHERE username = "${username}"`;
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
      var userToInsert = 'INSERT INTO users (username) VALUES ("' + username + '")';
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
      var roomExistQuery = `SELECT id FROM rooms WHERE roomname = "${roomname}"`;
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
      var roomToInsert = 'INSERT INTO rooms (roomname) VALUES ("' + roomname + '")';
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

