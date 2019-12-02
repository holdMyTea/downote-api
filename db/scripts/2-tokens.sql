CREATE TABLE downote.tokens (
  id CHAR(40) PRIMARY KEY,
  expires_on TIMESTAMP NOT NULL,
  user_id INT(8) UNSIGNED NOT NULL,
  FOREIGN KEY(user_id) REFERENCES downote.users(id) ON DELETE CASCADE
);
