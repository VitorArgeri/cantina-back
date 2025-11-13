import DiaryModel from "../models/diaryModel.js";

class DiaryController {
  // GET /api/diaries
  async getAllDiaries(req, res) {
    try {
      const diaries = await DiaryModel.findAll();
      res.json(diaries);
    } catch (error) {
      console.error("Erro ao buscar diaries:", error);
      res.status(500).json({ error: "Erro ao buscar diaries" });
    }
  }

  // GET /api/diaries/:id
  async getDiaryById(req, res) {
    try {
      const { id } = req.params;

      const diary = await DiaryModel.findById(id);

      if (!diary) {
        return res.status(404).json({ error: "Diary não encontrado" });
      }

      res.json(diary);
    } catch (error) {
      console.error("Erro ao buscar diary:", error);
      res.status(500).json({ error: "Erro ao buscar diary" });
    }
  }

  // POST /api/diaries
  async createDiary(req, res) {
    try {
      const { title, description } = req.body;

      if (!title || !description) {
        return res
          .status(400)
          .json({ error: "Os campos 'title' e 'description' são obrigatórios" });
      }

      const newDiary = await DiaryModel.create(title, description);

      if (!newDiary) {
        return res.status(400).json({ error: "Erro ao criar diary" });
      }

      res.status(201).json(newDiary);
    } catch (error) {
      console.error("Erro ao criar diary:", error);
      res.status(500).json({ error: "Erro ao criar diary" });
    }
  }

  // PUT /api/diaries/:id
  async updateDiary(req, res) {
    try {
      const { id } = req.params;
      const { title, description } = req.body;

      const updatedDiary = await DiaryModel.update(id, title, description);

      if (!updatedDiary) {
        return res.status(404).json({ error: "Diary não encontrado" });
      }

      res.json(updatedDiary);
    } catch (error) {
      console.error("Erro ao atualizar diary:", error);
      res.status(500).json({ error: "Erro ao atualizar diary" });
    }
  }

  // DELETE /api/diaries/:id
  async deleteDiary(req, res) {
    try {
      const { id } = req.params;

      const result = await DiaryModel.delete(id);

      if (!result) {
        return res.status(404).json({ error: "Diary não encontrado" });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Erro ao remover diary:", error);
      res.status(500).json({ error: "Erro ao remover diary" });
    }
  }
}

export default new DiaryController();