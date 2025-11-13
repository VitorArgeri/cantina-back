import prisma from "../../prisma/prisma.js";

class CharacterModel {
    // Obter todos os personagens
    async findAll() {
        const characters = await prisma.character.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                diary: true,
            },
        });

        return characters;
    }

    // Obter um personagem pelo ID
    async findById(id) {
        const character = await prisma.character.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                diary: true,
            },
        });

        return character;
    }

    // Criar um novo personagem
    async create(name, description, location, type, imgUrl, difficulty, diaryId) {
        const newCharacter = await prisma.character.create({
            data: {
                name,
                description,
                location,
                type,
                imgUrl,
                difficulty,
                diaryId,
            },
        });

        return newCharacter;
    }

    // Atualizar um personagem
    async update(id, name, description, location, type, imgUrl, difficulty, diaryId) {
        const character = await this.findById(id);

        if (!character) {
            return null;
        }

        const data = {};
        if (name !== undefined) {
            data.name = name;
        }
        if (description !== undefined) {
            data.description = description;
        }
        if (location !== undefined) {
            data.location = location;
        }
        if (imgUrl !== undefined) {
            data.imgUrl = imgUrl;
        }
        if (type !== undefined) {
            data.type = type;
        }
        if (difficulty !== undefined) {
            data.difficulty = difficulty;
        }
        if (diaryId !== undefined) {
            data.diaryId = diaryId;
        }

        const updatedCharacter = await prisma.character.update({
            where: {
                id: Number(id),
            },
            data,
        });

        return updatedCharacter;
    }

    // Remover um personagem
    async delete(id) {
        const character = await this.findById(id);

        if (!character) {
            return null;
        }

        await prisma.character.delete({
            where: {
                id: Number(id),
            },
        });

        return true;
    }
}

export default new CharacterModel();