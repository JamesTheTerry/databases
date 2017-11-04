CREATE DATABASE chat;

USE chat;

CREATE TABLE rooms (
  /* Describe your table here.*/
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  name CHAR(25)
);

CREATE TABLE users (
  /* Describe your table here.*/
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  name CHAR(25)
);

CREATE TABLE messages (
  /* Describe your table here.*/
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, 
  message CHAR(140), 
  username_id INT,
  room_id INT,
  FOREIGN KEY (username_id) REFERENCES users(id),
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

/* Create other tables and define schemas for them here! */




/*  Execute this file from the command line by typing:
 *    mysql -u root < server/schema.sql
 *    mysql -u student < server/schema.sql
 *  to create the database and the tables.*/

