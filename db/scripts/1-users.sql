CREATE TABLE downote.users (
  id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DELIMITER $$
CREATE PROCEDURE downote.insert_user (
  IN in_email VARCHAR(50),
  IN in_password VARCHAR(50)
) BEGIN
  INSERT INTO downote.users (email, password) VALUES (in_email, in_password);
END$$

CREATE PROCEDURE downote.search_user (
  IN in_email VARCHAR(50)
) BEGIN
  SELECT * FROM downote.users WHERE email=in_email;
END$$

DELIMITER ;
CALL downote.insert_user ('kappa@mail.com', '123123');
CALL downote.insert_user ('keepo@mail.com', '456456');
CALL downote.insert_user ('kippa@mail.com', '789789');

SELECT * FROM downote.users;
