const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

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
            attributes: ['spotId', 'startDate', 'endDate']
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
      let checkStartDate = new Date(startDate);
      let checkEndDate = new Date(endDate);

      for(let i = 0; i < existingBookings.length; i++){
         let existingStartDate = existingBookings[i].startDate;
         let existingEndDate = existingBookings[i].endDate;

         if(checkStartDate >= existingStartDate && checkStartDate <= existingEndDate){
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403;
            err.errors = {
               "startDate": "Start date conflicts with an existing booking",
               "endDate": "End date conflicts with an existing booking"
            }
            return res.json(err);
         } else if(checkEndDate >= existingStartDate && checkEndDate <= existingEndDate) {
            const err = new Error("Sorry, this spot is already booked for the specified dates");
            err.status = 403;
            err.errors = {
               "startDate": "Start date conflicts with an existing booking",
               "endDate": "End date conflicts with an existing booking"
            }
            return res.json(err);
         }
      }

         let newBooking = await Booking.create({
            spotId: spot.id,
            userId,
            startDate: checkStartDate,
            endDate: checkEndDate
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
router.post('/:spotId/reviews', requireAuth, async(req, res, next) => {
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
      ownedSpots[i].previewImage = image[0].url;
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
router.put('/:spotId', requireAuth, async( req, res, next ) => {
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
router.post('/', requireAuth, async( req, res, next ) => {
   const userId = req.user.id;
   const {address, city, state, country, lat, lng, name, description, price} = req.body;

   try{
   const newSpot = await Spot.create({
      ownerId: userId,
      address,
      city,
      state,
      country,
      lat: lat,
      lng: lng,
      name,
      description,
      price
   })
      res.statusCode = 201;
      res.json(newSpot)
   } catch (err){
         const error = new Error('Validation Error')
         error.statusCode = 400;
         error.errors = {
         "address": "Street address is required",
         "city": "City is required",
         "state": "State is required",
         "country": "Country is required",
         "lat": "Latitude is not valid",
         "lng": "Longitude is not valid",
         "name": "Name must be less than 50 characters",
         "description": "Description is required",
         "price": "Price per day is required"
       };
       console.log(error)
       res.json({
         message: 'Validation Error',
         ...error
      });
   }
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
      allSpots[i].previewImage = image[0].url;
      resp.push({ ...allSpots[i] });
   }

   res.json({
      Spots: resp,
      page,
      size
   })
})

module.exports = router;
