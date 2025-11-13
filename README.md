# SilksongProject (Back-end)
Olá, sou Vitor Argeri e este é o SilksongProject.  
O SilksongProject possui como objetivo compartilhar minha experiência com o jogo Hollow Knight: Silksong através de uma wiki contendo os NPCs, inimigos e bosses do jogo.

## Clonar o projeto
```bash
git clone https://github.com/VitorArgeri/Silksong-Back
cd Silksong-Back
```

## Instalar dependências
```bash
npm install
```

## Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto com:
```env
PORT=4001
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua_chave_secreta_aqui"
```

## Banco de dados (Prisma)
Aplicar as migrações:
```bash
npx prisma migrate dev
npx prisma generate
```

## Rodar o servidor
```bash
npm run dev
```
A API ficará disponível em: http://localhost:4001

## Recursos e Endpoints

- Characters:
  - Endpoints: GET (listar todos), GET /:id (por id), POST (criar), PUT /:id (atualizar), DELETE /:id (remover)
  - Atributos (desconsiderando createdAt):  
    id, name, description, type, location, imgUrl, difficulty, diaryId

- Diaries:
  - Endpoints: GET (listar todos), GET /:id (por id), POST (criar), PUT /:id (atualizar), DELETE /:id (remover)
  - Atributos (desconsiderando createdAt):  
    id, title, description