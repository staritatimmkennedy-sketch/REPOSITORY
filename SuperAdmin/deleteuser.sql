DELIMITER $$
CREATE PROCEDURE `sp_deleteUser` (IN inUserId VARCHAR(50))
BEGIN
  DELETE FROM material_borrowing WHERE student_id = inUserId OR librarian_id = inUserId;
  DELETE FROM material_publishing WHERE librarian_id = inUserId;
  DELETE FROM material_submission WHERE user_id = inUserId OR dean_id = inUserId;
  DELETE FROM user_college WHERE user_id = inUserId;
  DELETE FROM user_course WHERE userCourse_id IN (
    SELECT userCourse_id FROM user WHERE user_id = inUserId
  );
  DELETE FROM user WHERE user_id = inUserId;
END$$
DELIMITER ;
