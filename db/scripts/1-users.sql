CREATE TABLE downote.users (
  id INT(8) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(50) NOT NULL,
  password VARCHAR(50) NOT NULL,
  creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO downote.users (email, password) VALUES
  ('kappa@mail.com', '123123'),
  ('keepo@mail.com', '456456'),
  ('kippa@mail.com', '789789');

SELECT * FROM downote.users;
