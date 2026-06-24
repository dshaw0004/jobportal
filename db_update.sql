ALTER TABLE jobseeker MODIFY COLUMN name varchar(100) DEFAULT NULL;
ALTER TABLE jobseeker ADD COLUMN about_me TEXT;
ALTER TABLE jobseeker ADD COLUMN sector_reason TEXT;
ALTER TABLE jobseeker ADD COLUMN scenario_evaluation TEXT;
ALTER TABLE jobseeker ADD COLUMN onboarding_completed TINYINT(1) DEFAULT 0;
ALTER TABLE jobseeker ADD COLUMN chat_history TEXT;
