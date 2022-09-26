const express = require('express');
const { Spot, Review, SpotImage, sequelize, User, ReviewImage, Booking } = require('../../db/models');
const spot = require('../../db/models/spot');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const {Op} = require('sequelize');
const router = express.Router();

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


module.exports = router;
