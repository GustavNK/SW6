"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    // SQL Lines for easy use
    usersFromIds: `SELECT id, username, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"
    from azdev.users
    WHERE id = ANY($1)
    `,
    userInsert: `
    INSERT INTO azdev.users (username, password, first_name, last_name)
    VALUES ($1, $2, $3, $4)
    RETURNING id, username, first_name AS "firstName", last_name AS "lastName", created_at AS "createdAt"
  `
};
//# sourceMappingURL=sqls.js.map