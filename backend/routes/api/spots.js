const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

//Use Express Validator to validate body content of an inputted spot
const validateSpot = [
   check('address')
     .exists({ checkFalsy: true })
     .withMessage('Street address is required.'),
   check('address')
      .isLength({max: 255})
      .withMessage('Street address has a character limit of 255.'),
   check('city')
     .exists({ checkFalsy: true })
     .isAlpha('en-US', {ignore: ' '})
     .withMessage('City is required and can only contain letters.'),
   check('city')
     .isLength({max: 255})
     .withMessage('City has a character limit of 255.'),
   check('state')
     .exists({ checkFalsy: true })
     .isAlpha('en-US', {ignore: ' '})
     .withMessage('State is required and can only contain letters.'),
   check('state')
     .isLength({max: 255})
     .withMessage('State has a character limit of 255.'),
   check('country')
     .exists({ checkFalsy: true })
     .isAlpha('en-US', {ignore: ' '})
     .withMessage('Country is required and can only contain letters.'),
   check('country')
     .isLength({max: 255})
     .withMessage('Country has a character limit of 255.'),
   check('name')
     .exists({ checkFalsy: true })
     .isLength({ min: 1, max: 50 })
     .withMessage('Name must exist and be less than 50 characters.'),
   check('description')
     .exists({ checkFalsy: true })
     .withMessage('Description is required.'),
   check('description')
      .isLength({max: 255})
      .withMessage("Description has a character limit of 255."),
   check('price')
     .exists({ checkFalsy: true })
     .isInt({min: 1})
     .withMessage('Price per day is required and must be greater than 0.'),
   handleValidationErrors
 ];

 //Use Express Validator to validate body content of an inputted review
 const validateReview = [
   check('review')
     .exists({ checkFalsy: true })
     .isLength({min: 1, max: 255})
     .withMessage('Review text is required. Character Limit: 255'),
   check('stars')
     .exists({ checkFalsy: true })
     .isInt({gt: 0, lt: 6})
     .withMessage('Stars must be an integer from 1 to 5.'),
   handleValidationErrors
 ];


//Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else {
      if(spot.ownerId === userId){ //If user is owner of spot
         const bookings = await Booking.findAll({
            where: {
               spotId: spot.id
            },
            include: {
               model: User,
               attributes: ['id', 'firstName', 'lastName']
            }
         })

         res.json({
            "Bookings": bookings
         })
      } else { //If user is NOT owner of spot
         const bookings = await Booking.findAll({
            where: {
               spotId: spot.id
            },
            attributes: ['id','spotId', 'startDate', 'endDate']
         });

         res.json({
            "Bookings": bookings
         })
      }
   }

})

//Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async(req, res, next) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;

   const {startDate, endDate} = req.body;
   //Body Validation error if endDate is less than or equal to startDate
   let checkStartDate = new Date(startDate);
   let checkEndDate = new Date(endDate);

   if(checkEndDate <= checkStartDate){
      res.statusCode = 400;
      return res.json({
         "message": "Validation error",
         "statusCode": 400,
         "errors": {
           "endDate": "endDate cannot be on or before startDate"
         }
       })
   }

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if(spot.ownerId === userId){
      const err = new Error("Spot must not belong to user for booking");
      err.status = 403;
      return next(err);
   } else {
      //Check Dates for Booking Conflicts
      const existingBookings = await Booking.findAll({
         where: {
            spotId: spot.id
         }
      });

      for(let i = 0; i < existingBookings.length; i++){
         let existingStartDate = new Date(existingBookings[i].startDate);
         let existingEndDate = new Date(existingBookings[i].endDate);

         let errors = {};
         if(checkStartDate >= existingStartDate && checkStartDate <= existingEndDate){
            errors.startDate = "Start date conflicts with an existing booking";
         }
         if(checkEndDate >= existingStartDate && checkEndDate <= existingEndDate) {
            errors.endDate = "End date conflicts with an existing booking";
         }

         if(Object.keys(errors).length){
            res.statusCode = 403;
            return res.json({
               "message": "Sorry, this spot is already booked for the specified dates",
               "statusCode": 403,
               errors
            });
         }
      }

         let newBooking = await Booking.create({
            spotId: spot.id,
            userId,
            startDate: startDate,
            endDate: endDate
         })

         res.json(newBooking)

   }
})

//Get all Reviews by a Spot's Id
router.get('/:spotId/reviews', async(req, res, next) => {
   const spot = await Spot.findByPk(req.params.spotId);

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else {
      const reviews = await Review.findAll({
         where: {
            spotId: spot.id
         },
         include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName']
         }, {
            model: ReviewImage,
            attributes: ['id', 'url']
         }]
      })

      res.json({
         'Reviews': reviews
      });
   }

})

//Create a Review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, validateReview, async(req, res, next) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;
   const { review, stars } = req.body;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else {
      const existingReview = await Review.findAll({
         where: {
            [Op.and]: [
               { spotId: spot.id },
               { userId: userId }
            ]
         }
      });

      if(existingReview.length){
         const err = new Error("User already has a review for this spot");
         err.status = 403;
         return next(err);
      } else {
         let newReview = await Review.create({
            userId,
            spotId: spot.id,
            review,
            stars
         })
         res.statusCode = 201;
         res.json(newReview);
      }
   }
})

//Add an Image to a Spot based on the Spot's Id
router.post('/:spotId/images', requireAuth, async(req, res, next) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;
   const {url, preview} = req.body;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== spot.ownerId){
      const err = new Error('User is not owner of spot');
      err.status = 403;
      return next(err);
   } else {
      const newImage = await SpotImage.create({
         spotId: spot.id,
         url,
         preview
      })
      res.json({
         id: newImage.id,
         url: newImage.url,
         preview: newImage.preview
      });
   }

})

//Get all spots owned by current user
router.get('/current', requireAuth, async(req, res, next) => {
   const userId = req.user.id;
   const ownedSpots = await Spot.findAll({
      where: {
         ownerId: userId
      },
      raw: true
   })
   let resp = []
   for(let i = 0; i < ownedSpots.length; i++){
      const avg = await Review.findAll({
               where: {spotId: ownedSpots[i].id},
               attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
               raw: true
            });

      const image = await SpotImage.findAll({
         where: {
            spotId: ownedSpots[i].id
         },
         attributes: ['url'],
         raw: true
      })
      ownedSpots[i].avgRating = Number(avg[0].avgRating);
      image.length ? ownedSpots[i].previewImage = image[0].url: ownedSpots[i].previewImage = null;
      resp.push({ ...ownedSpots[i] })
   }

   res.json({Spots: resp})
})

//Delete a Spot
router.delete('/:spotId', requireAuth, async( req, res, next ) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== spot.ownerId){
      const err = new Error('User is not owner of spot');
      err.status = 403;
      return next(err);
   } else {
      await spot.destroy();
      res.json({
         "message": "Successfully deleted",
         "statusCode": 200
      })
   }
})

//Edit a Spot
router.put('/:spotId', requireAuth, validateSpot, async( req, res, next ) => {
   const spot = await Spot.findByPk(req.params.spotId);
   const userId = req.user.id;
   const {address, city, state, country, lat, lng, name, description, price} = req.body;

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      return next(err);
   } else if (userId !== spot.ownerId){
      const err = new Error('User is not owner of spot');
      err.status = 403;
      return next(err);
   } else {
      spot.set({
         address, city, state, country, lat, lng, name, description, price
      })
      await spot.save();
      res.json(spot);
   }
})

//Get details of a Spot from an Id
router.get('/:spotId', async( req, res, next ) => {
   const spot = await Spot.findByPk(req.params.spotId, {
      include: [{
         model: SpotImage,
         attributes: ['id', 'url', 'preview']
      }, {
         model: User,
         as: 'Owner',
         attributes: ['id', 'firstName', 'lastName']
      }]
   });

   if(!spot){
      const err = new Error("Spot couldn't be found");
      err.status = 404;
      next(err);
   } else {
      const reviewData = await Review.findAll({
         where: {
            spotId: spot.id
         },
         attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating'],
                     [sequelize.fn('COUNT', sequelize.col('id')), 'numReviews']],
         raw: true
      });

      spot.dataValues.numReviews = reviewData[0].numReviews;
      spot.dataValues.avgStarRating = reviewData[0].avgRating;

      res.json(spot)
   }
})


//Create a spot
router.post('/', requireAuth, validateSpot, async( req, res, next ) => {
   const userId = req.user.id;
   const {address, city, state, country, lat, lng, name, description, price} = req.body;

   const newSpot = await Spot.create({
      ownerId: userId,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
   })
      res.statusCode = 201;
      res.json(newSpot)

})

//Get all spots
router.get('/', async(req, res) => {
   let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
   const {Op} = require('sequelize');

   let limit;
   let offset;
   let where = {};
   let errors = {};

   //Check page query
   if(!page || isNaN(parseInt(page))) page = 1;
   else if (parseInt(page < 1)){
      errors.page = "Page must be greater than or equal to 1"
   }

   //Check size query
   if(!size || isNaN(parseInt(size))) size = 20;
   else if (parseInt(size < 1)){
      errors.size = "Size must be greater than or equal to 1"
   }

   //Check minLat
   if(minLat && isNaN(minLat)){
      errors.minLat = "Minimum latitude is invalid"
   } else if (minLat && !maxLat){
      where.lat = {[Op.gte]: Number(minLat)}
   }

   //Check maxLat
   if(maxLat && isNaN(maxLat)){
      errors.maxLat = "Maximum latitude is invalid"
   } else if (maxLat && !minLat){
      where.lat = {[Op.lte]: Number(maxLat)}
   } else if (maxLat && minLat){
      where.lat = {[Op.between]: [Number(minLat), Number(maxLat)]}
   }

   //Check minLng
   if(minLng && isNaN(minLng)){
      errors.minLng = "Minimum longitude is invalid"
   } else if (minLng && !maxLng){
      where.lng = {[Op.gte]: Number(minLng)}
   }

   //Check maxLng
   if(maxLng && isNaN(maxLng)){
      errors.maxLng = "Maximum longitude is invalid"
   } else if (maxLng && !minLng){
      where.lng = {[Op.lte]: Number(maxLng)}
   } else if(maxLng && minLng){
      where.lng = {[Op.between]: [Number(minLng), Number(maxLng)]}
   }

   //Check minPrice
   if(minPrice && (parseInt(minPrice) < 0)){
      errors.minPrice = "Minimum price must be greater than or equal to 0"
   } else if (minPrice && !maxPrice){
      where.price = {[Op.gte]: Number(minPrice)}
   }

   //Check maxPrice
   if(maxPrice && (parseInt(maxPrice) < 0)){
      errors.maxPrice = "Maximum price must be greater than or equal to 0"
   } else if (maxPrice && !minPrice){
      where.price = {[Op.lte]: Number(maxPrice)}
   } else if (maxPrice && minPrice){
      where.price = {[Op.between]: [Number(minPrice), Number(maxPrice)]}
   }

   //If any errors exist, Send error message
   if(Object.keys(errors).length){
      res.status = 400;
      let error = {
         "message": "Validation Error",
         "statusCode": 400,
         errors
      }
      return res.json(error);
   } else {
      page = parseInt(page);
      size = parseInt(size);
      limit = size;
      offset = size * (page - 1)
   }

   const allSpots = await Spot.findAll({where, limit, offset, raw: true});

   let resp = []
   for(let i = 0; i < allSpots.length; i++){
      const avg = await Review.findAll({
         where: {spotId: allSpots[i].id},
         attributes: [[sequelize.fn('AVG', sequelize.col('stars')), 'avgRating']],
            raw: true
         });

      const image = await SpotImage.findAll({
         where: {
            spotId: allSpots[i].id
         },
         attribute: ['url'],
         raw: true
      });

      allSpots[i].avgRating = Number(avg[0].avgRating);
      image.length ? allSpots[i].previewImage = image[0].url : allSpots[i].previewImage = null;

      resp.push({ ...allSpots[i] });
   }

   res.json({
      Spots: resp,
      page,
      size
   })
})

module.exports = {router, validateReview};
