const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { getMyReviews, updateReview, deleteReview } = require('../controllers/reviewController');

router.get('/my', authMiddleware, getMyReviews);
router.put('/:scholarshipId/:reviewId', authMiddleware, updateReview);
router.delete('/:scholarshipId/:reviewId', authMiddleware, deleteReview);

module.exports = router;