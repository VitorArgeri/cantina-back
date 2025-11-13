import express from "express";
import DiaryController from "../controllers/diaryController.js";

const diariesRouter = express.Router();

// Rotas de Diaries
// GET /api/diaries - Listar todos os diaries
diariesRouter.get("/", DiaryController.getAllDiaries);

// GET /api/diaries/:id - Obter um diary pelo ID
diariesRouter.get("/:id", DiaryController.getDiaryById);

// POST /api/diaries - Criar um novo diary
diariesRouter.post("/", DiaryController.createDiary);

// PUT /api/diaries/:id - Atualizar um diary
diariesRouter.put("/:id", DiaryController.updateDiary);

// DELETE /api/diaries/:id - Remover um diary
diariesRouter.delete("/:id", DiaryController.deleteDiary);

export default diariesRouter;