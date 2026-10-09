import express from 'express';
import {
  getItems,
  createItem,
  getItemById,
  updateItem,
} from '../controllers/itemController.js';

const router = express.Router();

router.get('/', getItems);
router.post('/', createItem);
router.get('/:id', getItemById);
router.patch('/:id', updateItem);

export default router;
