# Authentication User CRUD

## Goal
Add a user management page under `modules/authentication-manager-ui/views/system/User` with create, read, update, and delete capabilities.

## Requirements
- Provide user list/query view for existing users
- Support creating a user
- Support editing user details
- Support deleting a user
- Keep compatibility with existing permission buttons and module conventions

## Acceptance Criteria
- [ ] `system/User` route renders a user management page
- [ ] Users can be queried in table form
- [ ] Add dialog can create users
- [ ] Edit dialog can update users
- [ ] Delete action removes users and refreshes table

## Technical Notes
- Reuse APIs from `modules/authentication-manager-ui/api/system/user.ts`
- Follow existing `j-pro-table` + `pro-search` pattern used in this module
