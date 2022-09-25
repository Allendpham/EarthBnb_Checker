const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

router.post('/:reviewId/images', requireAuth, async(req, res, next) => {
   const review = await Review.findByPk(req.params.reviewId);
   const userId = req.user.id;
   const {url} = req.body;

   if(!review){
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
   } else{
      const existingImages = await ReviewImage.findAll({
         where: {
            reviewId: review.id
         }
      })

      if (userId !== review.userId){
         const err = new Error('User is not owner of spot');
         err.status = 403;
         return next(err);
      } else if(existingImages.length === 10){
         res.statusCode = 403;
         return res.json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
          })
      } else {
         let newImage = await ReviewImage.create({
            reviewId: review.id,
            url
         })
         res.json({
            id: newImage.id,
            url: newImage.url
         });
      }
   }
})


module.exports = router;
