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
      
      module.exports.rooms.get(bodyObj.roomname, function(queryRoomID) {
        if (queryRoomID !== undefined) {
          roomID = queryRoomID;
        } else {
          db.query('SELECT COUNT(*) FROM rooms', function(err, result) {
            if (err) {
              console.log(err);
            } else {
              roomID = result[0]['COUNT(*)'] + 1;
              module.exports.rooms.post(bodyObj.roomname);
            }
          });
        }
      });
      
      module.exports.users.get(bodyObj.username, function(queryUserID) {
        if (queryUserID !== undefined) {
          userID = queryUserID;
        } else {
          db.query('SELECT COUNT(*) FROM users', function(err, result) {
            if (err) {
              console.log(err);
            } else {
              userID = result[0]['COUNT(*)'] + 1;
              module.exports.users.post(bodyObj.username);
            }
          });
        }
      });
      
      var messsageToInsert = `INSERT INTO messages (message, username_id, room_id) VALUES ("${bodyObj.message}", "${userID}", "${roomID}")`;
      console.log('MTI', messsageToInsert);
      
      
      
      // var roomToInsert = 'INSERT INTO rooms (name) VALUES ("' + bodyObj.roomname + '")';
      // console.log('roomToInsert', roomToInsert);
      // db.query(roomToInsert, function(err, result) {
      //   if (err) {
      //     console.log (err);
      //   } else {
      //     console.log('Data inserted into rooms table');
      //   }
      // });
      
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
    post: function(username) {
      var userToInsert = 'INSERT INTO users (name) VALUES ("' + username + '")';
      console.log('userToInsert', userToInsert);
      db.query(userToInsert, function(err, result) {
        if (err) {
          console.log (err);
        } else {
          console.log('Data inserted into users table');
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

