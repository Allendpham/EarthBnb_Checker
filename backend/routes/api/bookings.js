const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

//Delete a Booking
router.delete('/:bookingId', requireAuth, async(req, res, next) => {
   const userId = req.user.id;
   const booking = await Booking.findByPk(req.params.bookingId);
   let currentDate = new Date();

   if(!booking){
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      return next(err);
   } else {

      let spot = await booking.getSpot();
      if((booking.userId !== userId) && (spot.ownerId !== userId)){
         const err = new Error('Booking must belong to user or Spot must be owned by user');
         err.status = 403;
         return next(err);
      } else if(booking.startDate < currentDate){
         const err = new Error("Bookings that have been started can't be deleted");
         err.status = 403;
         return next(err);
      } else {
         await booking.destroy();
         res.json({
            "message": "Successfully deleted",
            "statusCode": 200
          });
      }

   }
})

//Get all of the current user's bookings
router.get('/current', requireAuth, async (req, res, next) => {
   const userId = req.user.id;

   let bookings = await Booking.findAll({
      where: {
         userId: userId
      }
   });

   let resp = [];
   for(let i = 0; i < bookings.length; i++){
      let bookingData = bookings[i];
      let spotData = await bookingData.getSpot();
      let previewImage = await SpotImage.findAll({
         where: {
            spotId: spotData.id
         },
         attribute: ['url'],
         raw: true
      });

      bookingData.dataValues.Spot = {
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
      resp.push(bookingData);
   }

   res.json({
      'Bookings': resp
   })
})

//Edit a Booking
router.put('/:bookingId', requireAuth, async(req, res, next) => {
   const userId = req.user.id;
   const booking = await Booking.findByPk(req.params.bookingId);
   const currentDate = new Date();
   const {startDate, endDate} = req.body;

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

   if(!booking){
      const err = new Error("Booking couldn't be found");
      err.status = 404;
      return next(err);
   } else if (booking.userId !== userId){
      const err = new Error("User is not owner of booking");
      err.status = 403;
      return next(err);
   } else if(booking.endDate < currentDate){
      const err = new Error("Past bookings can't be modified");
      err.status = 403;
      return res.json(err);
   } else {
      //Check Dates for Booking Conflicts
      const existingBookings = await Booking.findAll({
         where: {
            spotId: booking.spotId
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
         console.log(existingStartDate, existingEndDate)
         console.log(startDate, endDate)
         if(Object.keys(errors).length){
            res.statusCode = 403;
            return res.json({
               "message": "Sorry, this spot is already booked for the specified dates",
               "statusCode": 403,
               errors
            });
         }
      }

      booking.set({
         spotId: booking.spotId,
         userId: userId,
         startDate: startDate,
         endDate: endDate
      });
      await booking.save();
      res.json(booking);
   }
})


module.exports = router;
