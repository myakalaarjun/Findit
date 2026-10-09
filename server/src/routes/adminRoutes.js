import express from 'express';
import {
  getAdminReports,
  updateAdminReport,
} from '../controllers/moderationController.js';

const router = express.Router();

// Development admin routes - require auth/RBAC in production
router.get('/reports', getAdminReports);
router.patch('/reports/:id', updateAdminReport);

export default router;
