import express from 'express';
import { createReport } from '../controllers/moderationController.js';

const router = express.Router();

router.post('/reports', createReport);

export default router;
