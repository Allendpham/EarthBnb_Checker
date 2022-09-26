const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

//Delete a Review Image
router.delete('/:imageId', requireAuth, async(req, res, next) => {
   const userId = req.user.id;
   const image = await ReviewImage.findByPk(req.params.imageId);

   if(!image){
      const err = new Error("Review Image couldn't be found");
      err.status = 404;
      return next(err);
   } else {
      const review = await Review.findByPk(image.reviewId);
      if(review.userId !== userId){
         const err = new Error("Review must belong to the current user")
         err.statusCode = 403;
         return res.json(err);
      } else {
         await image.destroy();
         res.json({
            "message": "Successfully deleted",
            "statusCode": 200
          })
      }
   }
})


module.exports = router;
