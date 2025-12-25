"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestCommentController = void 0;
const requestComment_service_1 = require("./requestComment.service");
class RequestCommentController {
    async create(req, res) {
        try {
            const current = req.user;
            if (!current || !current.userId) {
                return res.status(401).json({ message: "Требуется авторизация" });
            }
            const { requestId, text } = req.body;
            if (!requestId || !text) {
                return res.status(400).json({ message: "Поля requestId и text обязательны" });
            }
            const created = await requestComment_service_1.requestCommentService.createComment({
                requestId,
                authorId: current.userId,
                text
            });
            return res.status(201).json({ comment: created });
        }
        catch (err) {
            console.error("Create comment error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    async listByRequest(req, res) {
        try {
            const { requestId } = req.params;
            const list = await requestComment_service_1.requestCommentService.listByRequestId(requestId);
            return res.status(200).json({ comments: list });
        }
        catch (err) {
            console.error("List comments error:", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.requestCommentController = new RequestCommentController();
