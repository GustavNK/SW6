"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // SQL Lines for easy use
    // userFromId: `SELECT id, username, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"
    // from azdev.users
    // WHERE id = $1
    // `,
    userFromId: `SELECT * from azdev.users WHERE id = $1`,
    getAllUsers: `SELECT * from azdev.users`,
    userInsert: `
    INSERT INTO azdev.users (username, hashed_password, first_name, last_name, hashed_auth_token)
    VALUES ($1, 'non', $2, $3, 'bob')
    RETURNING id, username, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"
  `
};
//# sourceMappingURL=sqls.js.map