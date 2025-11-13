import prisma from "../../prisma/prisma.js";

class DiaryModel {
  // Obter todos os diários
  async findAll() {
    const diaries = await prisma.diary.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        characters: true,
      },
    });

    return diaries;
  }

  // Obter um diário pelo ID
  async findById(id) {
    const diary = await prisma.diary.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        characters: true,
      },
    });

    return diary;
  }

  // Criar um novo diário
  async create(title, description) {
    const newDiary = await prisma.diary.create({
      data: {
        title,
        description,
      },
    });

    return newDiary;
  }

  // Atualizar um diário
  async update(id, title, description) {
    const diary = await this.findById(id);

    if (!diary) {
      return null;
    }

    const data = {};
    if (title !== undefined) {
      data.title = title;
    }
    if (description !== undefined) {
      data.description = description;
    }

    const diaryUpdated = await prisma.diary.update({
      where: {
        id: Number(id),
      },
      data,
    });

    return diaryUpdated;
  }

  // Remover um diário
  async delete(id) {
    const diary = await this.findById(id);

    if (!diary) {
      return null;
    }

    await prisma.diary.delete({
      where: {
        id: Number(id),
      },
    });

    return true;
  }
}

export default new DiaryModel();