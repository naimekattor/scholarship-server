const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { 
    createReview, 
    getMyReviews, 
    updateMyReview, 
    deleteMyReview, 
    getAllReviews,
    deleteReviewByAdmin
} = require('../controllers/reviewController');

// User creates a review for a specific scholarship
// This is the POST route that was causing the issue in the old file structure.
router.post('/:scholarshipId', authMiddleware, createReview);

// User gets their own reviews
router.get('/my', authMiddleware, getMyReviews);

// Admin/Moderator gets all reviews from all users
router.get('/', authMiddleware, roleMiddleware(['admin', 'moderator']), getAllReviews);

// User updates their own review
router.put('/:id', authMiddleware, updateMyReview);

// User deletes their own review
router.delete('/:id', authMiddleware, deleteMyReview);

// Admin/Moderator deletes any user's review
router.delete('/:id/admin', authMiddleware, roleMiddleware(['admin', 'moderator']), deleteReviewByAdmin);

module.exports = router;