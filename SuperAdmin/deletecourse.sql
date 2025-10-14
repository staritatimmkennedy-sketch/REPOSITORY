DELIMITER $$
CREATE PROCEDURE `sp_deleteCourse` (IN `inCourseId` INT)
BEGIN
    DECLARE courseExists INT DEFAULT 0;
    DECLARE courseInUse INT DEFAULT 0;
    
    -- Check if course exists
    SET courseExists = (SELECT COUNT(*) FROM course WHERE course_id = inCourseId);
    
    IF courseExists = 0 THEN
        SELECT 'Course not found' AS 'message', 0 AS 'rows_affected';
    ELSE
        -- Check if course is being used by any users
        SET courseInUse = (SELECT COUNT(*) FROM user WHERE userCourse_id = inCourseId);
        
        IF courseInUse > 0 THEN
            SELECT 'Cannot delete course: Course is assigned to users' AS 'message', 0 AS 'rows_affected';
        ELSE
            -- Delete from user_course junction table first
            DELETE FROM user_course WHERE course_id = inCourseId;
            
            -- Then delete the course
            DELETE FROM course WHERE course_id = inCourseId;
            
            SELECT 'Course deleted successfully' AS 'message', 1 AS 'rows_affected';
        END IF;
    END IF;
END$$
DELIMITER ;