"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestComments = void 0;
// src/db/schema/requestComments.ts
const pg_core_1 = require("drizzle-orm/pg-core");
const requests_1 = require("./requests");
const users_1 = require("./users");
exports.requestComments = (0, pg_core_1.pgTable)("request_comments", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    requestId: (0, pg_core_1.uuid)("request_id")
        .notNull()
        .references(() => requests_1.requests.id),
    authorId: (0, pg_core_1.uuid)("author_id")
        .notNull()
        .references(() => users_1.users.id),
    text: (0, pg_core_1.text)("text").notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true }).defaultNow().notNull(),
});
