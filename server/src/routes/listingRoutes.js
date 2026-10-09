import express from 'express';
import {
  getListings,
  createListing,
  getListingById,
  updateListing,
  markListingAsSold,
} from '../controllers/listingController.js';

const router = express.Router();

router.get('/', getListings);
router.post('/', createListing);
router.get('/:id', getListingById);
router.patch('/:id', updateListing);
router.post('/:id/sold', markListingAsSold);

export default router;
