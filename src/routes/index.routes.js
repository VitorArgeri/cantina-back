import express from "express";

// Importar todas as rotas
import authRouter from "./auth.routes.js";
import diariesRouter from "./diaryRouter.js";
import characterRouter from "./characterRouter.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Rotas públicas
router.use("/auth", authRouter);
router.use("/diaries", diariesRouter);
router.use("/characters", characterRouter);

// Rotas protegidas
router.use(authMiddleware);

export default router;