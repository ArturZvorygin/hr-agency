// src/modules/requestComments/requestComment.service.ts
import { db } from "../../db/db";
import { requestComments } from "../../db/schema/requestComments";
import { eq, desc } from "drizzle-orm";

type CreateCommentDTO = {
    requestId: string;
    authorId: string;
    text: string;
};

class RequestCommentService {
    async createComment(dto: CreateCommentDTO) {
        const [created] = await db
            .insert(requestComments)
            .values({
                requestId: dto.requestId,
                authorId: dto.authorId,
                text: dto.text,
            } as any)
            .returning();

        return created;
    }

    async listByRequestId(requestId: string) {
        const list = await db
            .select()
            .from(requestComments)
            .where(eq(requestComments.requestId, requestId))
            .orderBy(desc(requestComments.createdAt));

        return list;
    }
}

export const requestCommentService = new RequestCommentService();
