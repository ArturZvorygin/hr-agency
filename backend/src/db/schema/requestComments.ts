// src/db/schema/requestComments.ts
import {
    pgTable,
    uuid,
    text,
    timestamp
} from "drizzle-orm/pg-core";
import { requests } from "./requests";
import { users } from "./users";

export const requestComments = pgTable("request_comments", {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
        .notNull()
        .references(() => requests.id),
    authorId: uuid("author_id")
        .notNull()
        .references(() => users.id),
    text: text("text").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
