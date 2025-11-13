import CharacterModel from "../models/characterModel.js";

class CharacterController {
    // GET /api/characters
    async getAllCharacters(req, res) {
        try {
            const characters = await CharacterModel.findAll();
            res.json(characters);
        } catch (error) {
            console.error("Erro ao buscar personagens:", error);
            res.status(500).json({ error: "Erro ao buscar personagens" });
        }
    }

    // GET /api/characters/:id
    async getCharacterById(req, res) {
        try {
            const { id } = req.params;

            const character = await CharacterModel.findById(id);

            if (!character) {
                return res.status(404).json({ error: "Personagem não encontrado" });
            }

            res.json(character);
        } catch (error) {
            console.error("Erro ao buscar personagem:", error);
            res.status(500).json({ error: "Erro ao buscar personagem" });
        }
    }

    // POST /api/characters
    async createCharacter(req, res) {
        try {
            const { name, description, type, location, imgUrl, difficulty, diaryId } = req.body;

            if (!name || !description || !location || !type || !imgUrl || !difficulty || !diaryId) {
                return res.status(400).json({
                    error: "Os campos 'name', 'description', 'location', 'type', 'imgUrl', 'difficulty' e 'diaryId' são obrigatórios",
                });
            }

            const newCharacter = await CharacterModel.create(name, description, location, type, imgUrl, difficulty, diaryId);

            if (!newCharacter) {
                return res.status(400).json({ error: "Erro ao criar personagem" });
            }

            res.status(201).json(newCharacter);
        } catch (error) {
            console.error("Erro ao criar personagem:", error);
            res.status(500).json({ error: "Erro ao criar personagem" });
        }
    }

    // PUT /api/characters/:id
    async updateCharacter(req, res) {
        try {
            const { id } = req.params;
            const { name, description, type, location, imgUrl, difficulty, diaryId } = req.body;

            const updatedCharacter = await CharacterModel.update(id, name, description, location, type, imgUrl, difficulty, diaryId);

            if (!updatedCharacter) {
                return res.status(404).json({ error: "Personagem não encontrado" });
            }

            res.json(updatedCharacter);
        } catch (error) {
            console.error("Erro ao atualizar personagem:", error);
            res.status(500).json({ error: "Erro ao atualizar personagem" });
        }
    }

    // DELETE /api/characters/:id
    async deleteCharacter(req, res) {
        try {
            const { id } = req.params;

            const result = await CharacterModel.delete(id);

            if (!result) {
                return res.status(404).json({ error: "Personagem não encontrado" });
            }

            res.status(204).end();
        } catch (error) {
            console.error("Erro ao remover personagem:", error);
            res.status(500).json({ error: "Erro ao remover personagem" });
        }
    }
}

export default new CharacterController();