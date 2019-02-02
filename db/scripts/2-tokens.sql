CREATE TABLE downote.tokens (
  id CHAR(40) PRIMARY KEY,
  expires_on TIMESTAMP NOT NULL,
  user_id INT(8) UNSIGNED NOT NULL,
  FOREIGN KEY(user_id) REFERENCES downote.users(id) ON DELETE CASCADE
);

DELIMITER $$
CREATE PROCEDURE downote.insert_token (
  IN token CHAR(40),
  IN untill TIMESTAMP,
  IN user INT(8)
) BEGIN
  INSERT INTO downote.tokens (id, expires_on, user_id) VALUES (token, untill, user);
END$$
