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
  -- preserving a single token for a user
  DELETE FROM downote.tokens WHERE user_id = user;
  INSERT INTO downote.tokens (id, expires_on, user_id) VALUES (token, untill, user);
END$$

CREATE PROCEDURE downote.check_token (
  IN token CHAR(40)
) BEGIN
  -- removing token if expired
  DELETE FROM downote.tokens WHERE id = token AND expires_on < CURRENT_TIMESTAMP;
  SELECT * FROM downote.tokens WHERE tokens.id = BINARY token;
END$$

CREATE PROCEDURE downote.remove_token (
  IN token CHAR(40)
) BEGIN
  DELETE FROM downote.tokens WHERE id = token;
END$$
