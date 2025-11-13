import express from "express";
import CharacterController from "../controllers/characterController.js";

const characterRouter = express.Router();

// Rotas de Personagens
// GET /api/characters - Listar todos os personagens
characterRouter.get("/", CharacterController.getAllCharacters);

// GET /api/characters/:id - Obter um personagem pelo ID
characterRouter.get("/:id", CharacterController.getCharacterById);

// POST /api/characters - Criar um novo personagem
characterRouter.post("/", CharacterController.createCharacter);

// PUT /api/characters/:id - Atualizar um personagem
characterRouter.put("/:id", CharacterController.updateCharacter);

// DELETE /api/characters/:id - Remover um personagem
characterRouter.delete("/:id", CharacterController.deleteCharacter);

export default characterRouter;