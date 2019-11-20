CREATE TABLE downote.notes (
  id INT(40) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  created_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note_header VARCHAR(255),
  note_text TEXT,
  note_order INT(8) UNSIGNED NOT NULL,
  user_id INT(8) UNSIGNED NOT NULL,
  FOREIGN KEY (user_id) REFERENCES downote.users(id) ON DELETE CASCADE
);

DELIMITER $$
CREATE PROCEDURE downote.insert_note (
  IN header_value VARCHAR(255),
  IN text_value TEXT,
  IN order_value INT(8) UNSIGNED,
  IN user_value INT(8) UNSIGNED
) BEGIN
  INSERT INTO downote.notes(note_header, note_text, note_order, user_id)
    VALUES (header_value, text_value, order_value, user_value);
END$$

CREATE PROCEDURE downote.update_note_content (
  IN id_value INT(40) UNSIGNED,
  IN header_value VARCHAR(255),
  IN text_value TEXT
) BEGIN
  UPDATE downote.notes SET
    note_header = header_value,
    note_text = text_value,
    updated_time = CURRENT_TIMESTAMP
    WHERE id = id_value;
END$$

CREATE PROCEDURE downote.update_note_order (
  IN id_value INT(40) UNSIGNED,
  IN order_value INT(8) UNSIGNED
) BEGIN
  UPDATE downote.notes SET
    note_order = order_value
    WHERE id = id_value;
END$$

CREATE PROCEDURE downote.remove_note (
  IN id_value INT(40) UNSIGNED
) BEGIN
  DELETE FROM downote.notes WHERE id = id_value;
END$$

CREATE PROCEDURE downote.get_user_notes (
  IN user_value INT(8) UNSIGNED
) BEGIN
  SELECT * FROM downote.notes WHERE user_id = user_value;
END$$
