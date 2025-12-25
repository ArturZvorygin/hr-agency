"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCommentService = void 0;
// src/modules/requestComments/requestComment.service.ts
const db_1 = require("../../db/db");
const requestComments_1 = require("../../db/schema/requestComments");
const drizzle_orm_1 = require("drizzle-orm");
class RequestCommentService {
    async createComment(dto) {
        const [created] = await db_1.db
            .insert(requestComments_1.requestComments)
            .values({
            requestId: dto.requestId,
            authorId: dto.authorId,
            text: dto.text,
        })
            .returning();
        return created;
    }
    async listByRequestId(requestId) {
        const list = await db_1.db
            .select()
            .from(requestComments_1.requestComments)
            .where((0, drizzle_orm_1.eq)(requestComments_1.requestComments.requestId, requestId))
            .orderBy((0, drizzle_orm_1.desc)(requestComments_1.requestComments.createdAt));
        return list;
    }
}
exports.requestCommentService = new RequestCommentService();
