const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

//Add an Image to an Existing Review
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

//Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res, next) => {
   const userId = req.user.id;

   const reviews = await Review.findAll({
      where: {
         userId: userId
      },
      include: [{
         model: User,
         attributes: ['id', 'firstName', 'lastName']
      },
      {
         model: ReviewImage,
         attributes: ['id', 'url']
      }]
   });

   let resp = [];
   for(let i = 0; i < reviews.length; i++){
      let reviewData = reviews[i];
      let spotData = await reviewData.getSpot();
      let previewImage = await SpotImage.findAll({
         where: {
            spotId: spotData.id
         },
         attribute: ['url'],
         raw: true
      })

      reviewData.dataValues.Spot = {
         id: spotData.id,
         ownerId: spotData.ownerId,
         address: spotData.address,
         city: spotData.city,
         state: spotData.state,
         country: spotData.country,
         lat: spotData.lat,
         lng: spotData.lng,
         name: spotData.name,
         price: spotData.price,
         previewImage: previewImage[0].url
      }

      resp.push(reviewData);
   }

   res.json({
      'Reviews': resp
   });
})

//Edit a Review
router.put('/:reviewId', requireAuth, async(req, res, next) => {
   const reviewToEdit = await Review.findByPk(req.params.reviewId);
   const userId = req.user.id;
   const {review, stars} = req.body;

   if(!reviewToEdit){
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== reviewToEdit.userId){
      const err = new Error('User is not owner of review');
      err.status = 403;
      return next(err);
   } else {
      reviewToEdit.set({
         review,
         stars
      });
      await reviewToEdit.save();
      res.json(reviewToEdit);
   }
})

//Delete a Review
router.delete('/:reviewId', requireAuth, async(req, res, next) => {
   const userId = req.user.id;
   const review = await Review.findByPk(req.params.reviewId);

   if(!review){
      const err = new Error("Review couldn't be found");
      err.status = 404;
      return next(err);
   } else if(review.userId !== userId){
      const err = new Error('User is not owner of review');
      return next(err);
   } else {
      await review.destroy();
      res.json({
         "message": "Successfully deleted",
         "statusCode": 200
       })
   }
})


module.exports = router;
