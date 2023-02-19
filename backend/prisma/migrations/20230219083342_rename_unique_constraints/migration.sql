-- RenameIndex
ALTER TABLE `project` RENAME INDEX `project_key_key` TO `uq_issue_key`;

-- RenameIndex
ALTER TABLE `user` RENAME INDEX `user_username_key` TO `uq_user_username`;
